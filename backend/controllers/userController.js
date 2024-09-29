import { catchAsync } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    address,
    password,
    role,
    firstNiche,
    secondNiche,
    thirdNiche,
    coverLetter,
  } = req.body;

  // Correct field validation: check if all required fields are present
  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  // If role is 'Job Seeker', ensure job niches are provided
  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(
      new ErrorHandler("Please provide your preferred job niches.", 400)
    );
  }

  // Check if user already exists by email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email is already registered.", 400));
  }

  // Prepare user data
  const userData = {
    name,
    email,
    phone,
    address,
    password,
    role,
    niches: { firstNiche, secondNiche, thirdNiche },
    coverLetter,
  };

  // Check if resume file is uploaded and handle it via Cloudinary
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      { folder: "Job_Seekers_Resume" }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(
        new ErrorHandler("Failed to upload the resume to cloud", 500)
      );
    }
    userData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Save the user to the database
  const user = await User.create(userData);

  sendToken(user, 201, res, "User Registered. ");
});

export const login = catchAsync(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(new ErrorHandler("Please fill out all the fields.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
  if (user.role != role) {
    return next(new ErrorHandler("Invalid user role", 400));
  }

  sendToken(user, 201, res, "User logged in.");
});

export const logout = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User logged out.",
    });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const newUserDate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };

  const { firstNiche, secondNiche, thirdNiche } = newUserDate.niches;

  if (
    req.user.role == "Job Seeker" &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }
  if (req.files) {
    const { resume } = req.files;
    if (resume) {
      const currentResumeId = req.user.resume.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      newUserDate.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserDate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated.",
    user,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fill out all the fields.", 400));
  }
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});

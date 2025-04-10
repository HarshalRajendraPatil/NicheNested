const Resume = () => {
  return (
    <div className="resume-container">
      <h1 className="resume-title">Build Your Perfect Resume</h1>
      <p className="resume-subtitle">
        Enhance your career with a professional resume. Choose an option below.
      </p>

      <div className="resume-options">
        {/* Resume Builder Card */}
        <div className="resume-card">
          <img
            src="./resume-builder.png"
            alt="Resume Builder"
            className="resume-img"
          />
          <div className="resume-content">
            <h2>Resume Builder</h2>
            <p>
              Create a professional resume with our easy-to-use resume builder.
              Customize templates, add sections, and download your resume in
              minutes.
            </p>
            <a
              className="resume-btn"
              href="https://atscheckertrial.netlify.app"
              target="_blank"
            >
              Start Building
            </a>
          </div>
        </div>

        {/* ATS Score Checker Card */}
        <div className="resume-card">
          <img
            src="/ats-checker.png"
            alt="ATS Checker"
            className="resume-img"
          />
          <div className="resume-content">
            <h2>ATS Score Checker</h2>
            <p>
              Check how well your resume performs against Applicant Tracking
              Systems (ATS). Improve your resume to increase job interview
              chances.
            </p>
            <a
              href="https://ats-checker-1streamlit-run-main-py.onrender.com"
              className="resume-btn"
              target="_blank"
            >
              Check your resume score
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import jobReducer from "./slices/jobSlice.js";
import userReducer from "./slices/UserSlice.js";
import applicationReducer from "./slices/ApplicationSlice.js";
import updateProfileReducer from "./slices/UpdateProfileSlice.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  user: userReducer,
  jobs: jobReducer,
  applications: applicationReducer,
  updateProfile: updateProfileReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;

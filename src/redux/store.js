import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import videosReducer from "./videosSlice";
import savedSearches from "./savedSearchesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    savedSearches: savedSearches,
  },
});

export default store;

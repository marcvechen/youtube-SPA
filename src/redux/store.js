import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import videosReducer from "./videosSlice";
import savedSearches from "./savedSearchesSlice";
import { localStorageMiddleware } from "./localStorageMiddleware";
const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    savedSearches: savedSearches,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;

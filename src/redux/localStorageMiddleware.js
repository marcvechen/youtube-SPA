import { isAnyOf } from "@reduxjs/toolkit";
import {
  addSavedSearch,
  deleteSavedSearch,
  changeSavedSearch,
} from "./savedSearchesSlice";

const isSavedSearchesChange = isAnyOf(
  addSavedSearch,
  deleteSavedSearch,
  changeSavedSearch,
);

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (isSavedSearchesChange(action)) {
    const state = store.getState();
    localStorage.setItem(
      "savedSearches_" + state.auth.email,
      JSON.stringify(state.savedSearches.list),
    );
  }

  return result;
};

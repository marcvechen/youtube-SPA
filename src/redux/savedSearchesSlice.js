import { createSlice } from "@reduxjs/toolkit";

export const savedSearches = createSlice({
  name: "savedSearches",
  initialState: { list: [] },
  reducers: {
    loadSavedSearches(state, action) {
      const saved = localStorage.getItem("savedSearches_" + action.payload);
      if (saved !== null) {
        state.list = JSON.parse(saved);
      } else {
        state.list = [];
      }
    },
    addSavedSearch(state, action) {
      state.list.push({
        id: action.payload.id,
        title: action.payload.title,
        query: action.payload.query,
        maxResult: action.payload.maxResult,
        order: action.payload.order,
      });
    },
    deleteSavedSearch(state, action) {
      state.list = state.list.filter((item) => item.id !== action.payload.id);
    },
    changeSavedSearch(state, action) {
      state.list = state.list.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            title: action.payload.newTitle,
            maxResult: action.payload.maxResult,
            order: action.payload.order,
          };
        } else {
          return item;
        }
      });
    },
  },
  selectors: { selectList: (state) => state.list },
});
export const {
  loadSavedSearches,
  addSavedSearch,
  deleteSavedSearch,
  changeSavedSearch,
} = savedSearches.actions;
export const { selectList } = savedSearches.selectors;
export default savedSearches.reducer;

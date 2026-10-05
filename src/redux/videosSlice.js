import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
export const getVideos = createAsyncThunk(
  "videos/getVideos",
  async (searchInput, thunkAPI) => {
    try {
      const videoResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchInput.query}&type=video&maxResults=${searchInput.maxResult}&order=${searchInput.order}&key=${API_KEY}`,
      );
      const ids = videoResponse.data.items
        .map((item) => item.id.videoId)
        .join(",");

      const statisticsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${API_KEY}`,
      );
      const result = videoResponse.data.items.map((video) => {
        return {
          id: video.id.videoId,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          thumbnail:
            video.snippet.thumbnails.maxres?.url ||
            video.snippet.thumbnails.default.url,
          createDate: video.snippet.publishedAt,
          views: statisticsResponse.data.items.find(
            (stat) => stat.id === video.id.videoId,
          ).statistics.viewCount,
        };
      });
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data.message ||
          "Error while loading videos. Please try again later.",
      );
    }
  },
);
const videosSlice = createSlice({
  name: "videoSlice",
  initialState: { video: [], searchQuery: "", loading: false, error: null },
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearVideos(state, action) {
      state.video = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVideos.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.video = action.payload;
    });
    builder.addCase(getVideos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export const { setSearchQuery, clearVideos } = videosSlice.actions;
export default videosSlice.reducer;

import axios from "axios";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
const BASE_AUTH_URL = import.meta.env.VITE_AUTH_API_URL;

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${BASE_AUTH_URL}login`, data);
    localStorage.setItem("access_token", response.data.access_token);
    const decode = jwtDecode(response.data.access_token);
    return { decoded: decode, token: response.data.access_token };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data.message || "Login error. Please try again later.",
    );
  }
});
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_AUTH_URL}}register`, data);
      localStorage.setItem("access_token", response.data.access_token);
      const decode = jwtDecode(response.data.access_token);
      return { decoded: decode, token: response.data.access_token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data.message ||
          "Register error. Please try again later.",
      );
    }
  },
);
const token = localStorage.getItem("access_token");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token,
    email: token ? jwtDecode(token).email : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = "";
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.email = action.payload.decoded.email;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.email = action.payload.decoded.email;
    });
    builder.addMatcher(isAnyOf(login.pending, register.pending), (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(
      isAnyOf(login.rejected, register.rejected),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    );
  },
  selectors: { selectEmail: (state) => state.email },
});
export const { logout } = authSlice.actions;
export const { selectEmail } = authSlice.selectors;

export default authSlice.reducer;

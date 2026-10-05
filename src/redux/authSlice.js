import axios from "axios";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(
      "https://todo-redev.onrender.com/api/auth/login",
      data,
    );
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
      const response = await axios.post(
        "https://todo-redev.onrender.com/api/auth/register",
        data,
      );
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
  name: "authSlice",
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
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;

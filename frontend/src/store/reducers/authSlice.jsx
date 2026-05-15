import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instance } from "../../config/axios";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
};

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await instance.post(
        "/api/auth/register",
        {
          email: formData.email,
          password: formData.password,

          fullName: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
        },
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      // console.log(err);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Register failed",
      );
    }
  },
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const res = await instance.post(
        "/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      // console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

// CURRENT USER
export const currentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");

    // If no token, fail immediately without hitting the server
    if (!token) {
      return thunkAPI.rejectWithValue("No session found");
    }

    try {
      const res = await instance.get("/api/auth/currentUser", {
        withCredentials: true,
      });


      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  },
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const res = await instance.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Logout Failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          email: action.payload.email,
          id: action.payload._id,
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          name: action.payload.fullName,
          email: action.payload.email,
          id: action.payload._id,
        };

        // Persist to localStorage to survive refresh
        // localStorage.setItem("user", JSON.stringify(state.user));

        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(currentUserThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(currentUserThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          name: action.payload.fullName,
          email: action.payload.email,
          id: action.payload._id,
        };

        state.isAuthenticated = true;
        state.isInitialized = true;
      })

      .addCase(currentUserThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isInitialized = true;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;

        // Clear the local token as well
        localStorage.removeItem("token");
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;

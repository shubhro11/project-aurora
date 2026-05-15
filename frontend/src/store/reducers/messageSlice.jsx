import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../config/axios.js";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

// FETCH MESSAGES
export const fetchMessagesThunk = createAsyncThunk(
  "message/fetchMessages",

  async (chatId, thunkAPI) => {
    try {
      const res = await instance.get(`/api/chat/message/${chatId}`, {
        withCredentials: true,
      });

      return res.data.messages;
    } catch (err) {
      // console.log(err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

const messageSlice = createSlice({
  name: "message",
  initialState,

  reducers: {
    // USER RESPONSE
    addUserMessage: (state, action) => {
      state.messages.push({
        role: "user",
        content: action.payload,
        createdAt: new Date().toISOString(),
      });

      state.loading = true;
    },

    // SOCKET AI RESPONSE
    addAIMessage: (state, action) => {
      state.messages.push({
        role: "model",
        content: action.payload,
        createdAt: new Date().toISOString(),
      });

      state.loading = false;
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH

      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      });
  },
});

export const { addUserMessage, addAIMessage, clearMessages } =
  messageSlice.actions;

export default messageSlice.reducer;

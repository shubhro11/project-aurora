import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../config/axios.js";

const initialState = {
  chats: [],
  activeChatId: null,
  loading: false,
  error: null,
};

// FETCH CHATS
export const fetchChats = createAsyncThunk(
  "chat/fetchChats",

  async (_, thunkAPI) => {
    try {
      const res = await instance.get("/api/chat/getChats", {
        withCredentials: true,
      });


      return res.data.chats;
    } catch (err) {
      // console.log(err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch chats",
      );
    }
  },
);

// CREATE CHAT
export const createChatThunk = createAsyncThunk(
  "chat/createChat",

  async (title = "New Chat", thunkAPI) => {
    try {
      const res = await instance.post(
        "/api/chat/newChat",
        { title },
        {
          withCredentials: true,
        },
      );


      return res.data.chat;
    } catch (err) {
      // console.log(err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create chat",
      );
    }
  },
);

// DELETE CHAT
export const deleteChatThunk = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, thunkAPI) => {
    try {
      const res = await instance.delete(`/api/chat/delete-chat/${chatId}`, {
        withCredentials: true,
      });


      return res.data;
    } catch (err) {
      // console.log(err);
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    addChat: (state, action) => {
      // latest at top
      state.chats.unshift(action.payload);
    },

    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
    },

    updateActiveChatTitle: (state, action) => {
      const chat = state.chats.find(
        (c) => String(c._id) === String(state.activeChatId),
      );

      if (chat) {
        chat.title = action.payload;
      }
    },

    clearChats: (state) => {
      state.chats = [];
      state.activeChatId = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH CHATS
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;

        // latest first
        state.chats = [...action.payload].reverse();

        const savedChat = localStorage.getItem("activeChatId");
      })

      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      // CREATE CHAT
      .addCase(createChatThunk.fulfilled, (state, action) => {
        // newest at top
        state.chats.unshift(action.payload);

        state.activeChatId = action.payload._id;

        localStorage.setItem("activeChatId", action.payload._id);
      })

      .addCase(deleteChatThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteChatThunk.fulfilled, (state, action) => {
        state.loading = false;

        const deletedChatId = action.meta.arg;
        state.chats = state.chats.filter((chat) => chat._id !== deletedChatId);

        // If the chat we just deleted was the one being viewed, clear the active ID
        if (state.activeChatId === deletedChatId) {
          state.activeChatId = null;
        }
      });
  },
});

export const { addChat, setActiveChat, updateActiveChatTitle, clearChats } =
  chatSlice.actions;
export default chatSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./reducers/chatSlice";
import authSlice from "./reducers/authSlice";
import messageSlice from "./reducers/messageSlice";
import chatModalSlice from "./reducers/chatModalSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    message: messageSlice,
    chatModal: chatModalSlice
  },
});

export default store;

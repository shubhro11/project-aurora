import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: "",
};

const chatModalSlice = createSlice({
  name: "chatModal",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
  },
});

export const { setChatId } = chatModalSlice.actions;
export default chatModalSlice.reducer;

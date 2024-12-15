// src/store/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatRooms: [],
  selectedChatRoomId: null,
  selectedChatMessages: [],
  isChatStarted: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatRooms: (state, action) => {
      state.chatRooms = action.payload;
    },
    setSelectedChatRoomId: (state, action) => {
      state.selectedChatRoomId = action.payload;
      state.isChatStarted = false;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },
    setIsChatStarted: (state, action) => {
      state.isChatStarted = action.payload;
    },
  },
});

export const {
  setChatRooms,
  setSelectedChatRoomId,
  setSelectedChatMessages,
  setIsChatStarted,
} = chatSlice.actions;

export const selectChatRooms = (state) => state.chat.chatRooms;
export const selectSelectedChatRoomId = (state) =>
  state.chat.selectedChatRoomId;
export const selectSelectedChatMessages = (state) =>
  state.chat.selectedChatMessages;
export const selectIsChatStarted = (state) => state.chat.isChatStarted;

export default chatSlice.reducer;

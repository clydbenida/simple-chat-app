import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatSessionType, MessageType } from "../../types";


const initialState: ChatSessionType[] = [];

export const chatSessionsSlice = createSlice({
  name: 'chatSessions',
  initialState,
  reducers: {
    assignChatSessions: (_state, action: PayloadAction<ChatSessionType[]>) => {
      return [...action.payload]
    },
    pushSessionToTop: (state, action: PayloadAction<MessageType>) => {
      const popChatSession = state.filter(
        (item) => item.chat_session_id === action.payload.chat_session_id,
      );

      if (popChatSession) {
        const filteredChatSession = state
          .filter(
            (item) => item.chat_session_id !== action.payload.chat_session_id,
          )
        return [{ ...popChatSession[0], isRead: false, newMessageContent: action.payload.content }, ...filteredChatSession];
      }

      return state;
    }
  },
});

export const { assignChatSessions, pushSessionToTop } = chatSessionsSlice.actions;

export default chatSessionsSlice.reducer;

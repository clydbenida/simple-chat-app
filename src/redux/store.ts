import { configureStore } from "@reduxjs/toolkit";
import chatSessions from "./slices/chatSessions";

export const store = configureStore({
  reducer: {
    chatSessions: chatSessions,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

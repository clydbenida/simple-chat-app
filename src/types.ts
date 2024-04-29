import React from "react";

export interface ChatPageActionTypes {
  username: string;
}

export interface ChatProps {
  isConnected: boolean;
  selectedSession: ChatSessionType;
  currentUser: UserType;
  newChatMessage?: MessageType;
}

export interface ParticipantType {
  participant_id: number;
  chat_session_id: number;
  user: UserType;
}

export interface ChatSessionType {
  chat_session_id: number;
  chat_session_name?: string;
  participants: ParticipantType[];
}

export interface SideBarProps {
  currentUser?: UserType;
  selectedSession?: ChatSessionType;
  setSelectedSession: React.Dispatch<ChatSessionType | undefined>;
  handleOpenOnlineUsers: () => void;
  chatSessions?: ChatSessionType[];
}

export interface UserType {
  user_id: number,
  username: string,
}

export interface ChatItemProps {
  onClick: () => void;
  active: boolean;
  chatName: string;
  recentMessage: string;
}

export interface MessageType {
  message_id: number;
  chat_session_id: number;
  participant_id: number;
  content: string;
  read_status: boolean
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRowProps {
  content: string;
  isFromCurrentUser: boolean;
}

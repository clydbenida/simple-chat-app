import { DialogProps } from "@mui/material";
import React, { FormEvent, SetStateAction } from "react";

export type AttachmentTypes = string;

export interface ChatPageActionTypes {
  username: string;
}

export interface MediaCaptureDialogProps extends DialogProps {
  closeMediaCapture: () => void;
  setAttachments: React.Dispatch<SetStateAction<string[] | undefined>>;
}

export interface MessageComposerPropTypes {
  message: string;
  sendMessage: (e: FormEvent) => void;
  setMessage: React.Dispatch<string>;
  openMediaCapture: () => void;
  closeMediaCapture: () => void;
  attachments?: AttachmentTypes[];
}

export interface ConversationPanelProps {
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
  messages: MessageType[];
  isRead?: boolean;
  newMessageContent?: string;
}

export interface SideBarProps {
  currentUser?: UserType;
  selectedSession?: ChatSessionType;
  setSelectedSession: React.Dispatch<ChatSessionType | undefined>;
  handleOpenOnlineUsers: () => void;
  chatSessions?: ChatSessionType[];
  newChatMessage?: MessageType;
  setChatSessions?: React.Dispatch<SetStateAction<ChatSessionType[]>>;
}

export interface UserType {
  user_id: number;
  username: string;
}

export interface ChatItemProps {
  onClick: () => void;
  active: boolean;
  chatName: string;
  recentMessage: string;
  isRead: boolean;
}

export interface MessageType {
  message_id: number;
  chat_session_id: number;
  participant_id: number;
  content: string;
  read_status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRowProps {
  content: string;
  isFromCurrentUser: boolean;
}

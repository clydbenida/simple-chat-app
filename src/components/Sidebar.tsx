import { useCallback, useMemo } from "react";
import { ChatSessionType, ParticipantType, SideBarProps } from "../types";
import ChatItem from "./ChatItem";
import { Form } from "react-router-dom";

export default function Sidebar({
  chatSessions,
  handleOpenOnlineUsers,
  selectedSession,
  setSelectedSession,
  currentUser,
}: SideBarProps) {
  function handleClickChatItem(chatSession: ChatSessionType) {
    setSelectedSession(chatSession);
  }

  const generateChatName = useCallback(
    (participants: ParticipantType[]) => {
      const filteredParticipants = participants.filter(
        (participant) => participant.user.user_id !== currentUser?.user_id,
      );

      if (filteredParticipants.length === 1) {
        return filteredParticipants[0].user.username;
      }

      return filteredParticipants
        .map((participant) => participant.user.username)
        .join(", ");
    },
    [currentUser?.user_id],
  );

  const renderChatItems = useMemo(
    () => {
      return chatSessions!.map((item) => {
        const chatName =
          item.chat_session_name || generateChatName(item.participants);

        return (
          <ChatItem
            onClick={() => handleClickChatItem(item)}
            active={selectedSession?.chat_session_id === item.chat_session_id}
            chatName={chatName}
            isRead={Boolean(selectedSession?.isRead)}
            recentMessage={item.newMessageContent ?? item?.messages[0]?.content ?? "No message yet"}
          />
        );
      });
    },
    [chatSessions, selectedSession],
  );

  return (
    <div>
      <div className="pt-2 px-2 flex justify-between">
        <button
          onClick={handleOpenOnlineUsers}
          type="button"
          className="bg-lime-700 text-white p-2 px-4 rounded-lg"
        >
          New Chat
        </button>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="bg-amber-700 text-white p-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </Form>
      </div>
      <div className="px-2 overflow-y-auto ">{renderChatItems}</div>
    </div>
  );
}

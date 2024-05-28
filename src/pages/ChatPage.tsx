import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Sidebar from "../components/Sidebar";
import fetchAPI, { socket } from "../api";
import OnlineUsersDialog from "../components/OnlineUsersDialog";
import { ChatSessionType, MessageType, UserType } from "../types";
import ConversationPanel from "../components/ConversationPanel";

export default function ChatPage() {
  const navigate = useNavigate();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [user, setUser] = useState<UserType>();
  const [chatSessions, setChatSessions] = useState<ChatSessionType[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSessionType>();
  const [newMessage, setNewMessage] = useState<MessageType>();

  const token = Cookies.get("token");

  function handleOpenOnlineUsers() {
    setShowOnlineUsers(true);
  }

  function handleCloseOnlineUsers() {
    setShowOnlineUsers(false);
  }

  useEffect(() => {
    if (selectedSession) {
      socket.emit("join-session", selectedSession?.chat_session_id);

      socket.on("receive-message", (message) => {
        console.log("New Message is invoked");
        setNewMessage({
          chat_session_id: message.chat_session_id,
          content: message.content,
          read_status: false,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          message_id: message.message_id,
          participant_id: message.participant_id,
        });
      });
    }
  }, [selectedSession]);

  useEffect(() => {
    const userFromLocal = localStorage.getItem("user");
    if (!token || !userFromLocal) {
      navigate("/");

      return;
    }

    setUser(JSON.parse(userFromLocal));
  }, [token]);

  useEffect(() => {
    async function fetchChatSessions() {
      const { data } = await fetchAPI(
        "get",
        `/chat_session?user_id=${user?.user_id}`,
      );

      if (data) {
        setChatSessions(data);
      }
    }

    if (user?.user_id) {
      fetchChatSessions();
    }
  }, [user]);

  /*
   *  When a user receives a new message, this side effect puts the chat session with
   *  the new message to the top
   * */
  useEffect(() => {
    if (newMessage) {
      console.log("newMessage", newMessage);
      setChatSessions((prev) => {
        const prevState = [...prev];
        const popChatSession = prevState.filter(
          (item) => item.chat_session_id === newMessage.chat_session_id,
        );

        if (popChatSession) {
          const filteredChatSession = prevState
            .filter(
              (item) => item.chat_session_id !== newMessage.chat_session_id,
            )
          console.log("New chat session", prevState);
          return [{ ...popChatSession[0], isRead: false }, ...filteredChatSession];
        }

        return prev;
      });
    }
  }, [newMessage]);

  return (
    <div className="grid grid-cols-4 w-screen h-screen max-h-screen">
      <div className="border border-gray-200">
        <Sidebar
          currentUser={user!}
          setSelectedSession={setSelectedSession}
          selectedSession={selectedSession}
          chatSessions={chatSessions}
          handleOpenOnlineUsers={handleOpenOnlineUsers}
          newChatMessage={newMessage}
          setChatSessions={setChatSessions}
        />
      </div>

      <ConversationPanel
        currentUser={user!}
        selectedSession={selectedSession!}
        newChatMessage={newMessage}
      />

      <OnlineUsersDialog
        currentUser={user!}
        showOnlineUsers={showOnlineUsers}
        handleCloseOnlineUsers={handleCloseOnlineUsers}
        setSelectedSession={setSelectedSession}
      />
    </div>
  );
}

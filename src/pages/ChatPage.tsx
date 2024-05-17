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
  const [isConnected, setIsConnected] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [user, setUser] = useState<UserType>();
  const [chatSessions, setChatSessions] = useState<ChatSessionType[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSessionType>();
  const [newMessage, setNewMessage] = useState<MessageType>();

  const token = Cookies.get("token");

  function handleOpenOnlineUsers() {
    setShowOnlineUsers(true)
  }

  function handleCloseOnlineUsers() {
    setShowOnlineUsers(false)
  }

  useEffect(() => {
    if (selectedSession) {
      socket.emit('join-session', selectedSession?.chat_session_id);

      socket.on("receive-message", (message) => {
        setNewMessage({
          chat_session_id: message.chat_session_id,
          content: message.content,
          read_status: false,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          message_id: message.message_id,
          participant_id: message.participant_id
        });
      });
    }
  }, [selectedSession]);

  useEffect(() => {
    const userFromLocal = localStorage.getItem("user")
    if (!token || !userFromLocal) {
      navigate("/")

      return;
    }

    setUser(JSON.parse(userFromLocal));
  }, [token]);

  useEffect(() => {
    async function fetchChatSessions() {
      const { data } = await fetchAPI("get", `/chat_session?user_id=${user?.user_id}`)

      console.log("Chat sessions", data)
      if (data) {
        setChatSessions(data);
      }
    }

    if (user?.user_id) {
      fetchChatSessions();
    }
  }, [user]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, []);

  return (
    <div className="grid grid-cols-4 w-screen h-screen max-h-screen">
      <div className="border border-gray-200">
        <Sidebar
          currentUser={user!}
          setSelectedSession={setSelectedSession}
          selectedSession={selectedSession}
          chatSessions={chatSessions}
          handleOpenOnlineUsers={handleOpenOnlineUsers}
        />
      </div>

      <ConversationPanel
        currentUser={user!}
        selectedSession={selectedSession!}
        isConnected={isConnected}
        newChatMessage={newMessage}
      />

      <OnlineUsersDialog
        currentUser={user!}
        showOnlineUsers={showOnlineUsers}
        handleCloseOnlineUsers={handleCloseOnlineUsers}
        setSelectedSession={setSelectedSession}
      />
    </div>
  )
}

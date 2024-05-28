import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Sidebar from "../components/Sidebar";
import fetchAPI, { socket } from "../api";
import OnlineUsersDialog from "../components/OnlineUsersDialog";
import { ChatSessionType, MessageType, UserType } from "../types";
import ConversationPanel from "../components/ConversationPanel";
import { assignChatSessions, pushSessionToTop } from "../redux/slices/chatSessions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const chatSessions = useAppSelector(state => state.chatSessions);
  const navigate = useNavigate();

  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [user, setUser] = useState<UserType>();
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
    if (user) {
      socket.emit("join-session", user?.user_id);

      socket.on("receive-message", (message) => {
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
  }, [user]);

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
        console.log("dispatched action");
        dispatch(assignChatSessions(data));
      }
    }

    if (user?.user_id) {
      fetchChatSessions();
    }
  }, [user]);

  /*
   *  When a user receives a new message, this side effect puts the chat session with
   *  the new message to the top
   **/
  useEffect(() => {
    if (newMessage) {
      dispatch(pushSessionToTop(newMessage));
    }
  }, [newMessage]);

  console.log("Chat sessions: ", chatSessions)

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

import { useCallback, useEffect, useMemo, useState } from "react";
import fetchAPI, { socket } from "../api";
import { ChatProps, MessageType } from "../types";
import MessageRow from "./MessageRow";

export default function Chat({ isConnected, selectedSession, currentUser, newChatMessage }: ChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const currentUserParticipantId = useMemo(() => {
    if (selectedSession?.participants) {
      const participants = [...selectedSession.participants]
      const [currentUserParticipantDetails] = participants.filter(item => item.user.user_id === currentUser.user_id);

      return currentUserParticipantDetails.participant_id
    }
    return 0;
  }, [selectedSession, currentUser])

  const appendMessage = (newMessage: MessageType) => {
    setMessages(prev => {
      return ([newMessage, ...prev])
    });
  }

  const sendMessage = useCallback(() => {
    if (isConnected) {
      socket.emit("send-message", {
        message: message,
        chatSession: selectedSession,
        currentUser: currentUser
      }, () => {
        console.log("Message sent!");
      });

      appendMessage({
        content: message,
        chat_session_id: selectedSession.chat_session_id,
        createdAt: new Date(),
        updatedAt: new Date(),
        read_status: false,
        message_id: messages[0].message_id + 1,
        participant_id: currentUserParticipantId,
      })

      setMessage("");
    }
  }, [selectedSession, messages, message, currentUser, isConnected, currentUserParticipantId])

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await fetchAPI(
        "get",
        `/messages?limit=${10}&offset=${0}&chat_session_id=${selectedSession.chat_session_id}`
      )

      setMessages(data.rows);
    }

    if (selectedSession?.chat_session_id) {
      fetchMessages();
    }
  }, [selectedSession]);

  useEffect(() => {
    if (newChatMessage) {
      appendMessage(newChatMessage);
    }
  }, [newChatMessage]);

  const renderMessageRows = useMemo(() => messages.map(item => {
    return (
      <MessageRow
        content={item?.content}
        isFromCurrentUser={item?.participant_id === currentUserParticipantId}
      />
    )
  }), [messages, currentUserParticipantId]);

  return (
    <div className="col-span-3 h-full flex flex-col">
      {messages.length > 0 ?
        <div className="flex flex-grow flex-col-reverse px-3">
          {renderMessageRows}
        </div>
        :
        <div className="flex justify-center items-center flex-grow w-full bg-gray-50">
          'This is the chat page'
        </div>
      }
      <div className="h-14 flex p-2">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="bg-white flex-grow border-gray-100 rounded-lg border mr-2" />
        <button type="button" className="bg-sky-50 font-bold px-3" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

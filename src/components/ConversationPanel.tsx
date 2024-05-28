import { FormEvent, useEffect, useMemo, useState } from "react";
import fetchAPI, { socket } from "../api";
import { ConversationPanelProps, MessageType, ParticipantType } from "../types";
import MessageRow from "./MessageRow";
import { Call, MenuOpen } from "@mui/icons-material";
import MessageComposer from "./MessageComposer";
import MediaCaptureDialog from "./MediaCaptureDialog";

export default function ConversationPanel({
  selectedSession,
  currentUser,
  newChatMessage,
}: ConversationPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showMediaCapture, setShowMediaCapture] = useState(false);
  const [attachments, setAttachments] = useState<string[] | undefined>();

  const recepientDetails = useMemo<ParticipantType | undefined>(() => {
    if (selectedSession?.participants) {
      const participants = [...selectedSession.participants];
      const [recepientDetails] = participants.filter(
        (item) => item.user.user_id !== currentUser.user_id,
      );

      return recepientDetails;
    }
  }, [messages]);

  const currentUserParticipantId = useMemo(() => {
    if (selectedSession?.participants) {
      const participants = [...selectedSession.participants];
      const [currentUserParticipantDetails] = participants.filter(
        (item) => item.user.user_id === currentUser.user_id,
      );

      return currentUserParticipantDetails.participant_id;
    }
    return 0;
  }, [messages]);

  const appendMessage = (newMessage: MessageType) => {
    setMessages((prev) => {
      return [newMessage, ...prev];
    });
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (selectedSession) {
      socket.emit(
        "send-message",
        {
          message: message,
          chatSession: selectedSession,
          currentUser: currentUser,
          recepient_id: recepientDetails?.user.user_id
        },
        () => {
          console.log("Message sent!");
        },
      );

      appendMessage({
        content: message,
        chat_session_id: selectedSession?.chat_session_id,
        createdAt: new Date(),
        updatedAt: new Date(),
        read_status: false,
        message_id: messages[0].message_id + 1,
        participant_id: currentUserParticipantId,
      });

      setMessage("");
    }
  };

  const openMediaCaptureDialog = () => {
    setShowMediaCapture(true);
  };

  const closeMediaCaptureDialog = () => {
    setShowMediaCapture(false);
  };

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await fetchAPI(
        "get",
        `/messages?limit=${30}&offset=${0}&chat_session_id=${selectedSession.chat_session_id}`,
      );

      setMessages(data.rows);
    }

    if (selectedSession?.chat_session_id) {
      fetchMessages();
    }

    return () => {
      if (attachments?.length || message.length) {
        console.log("trigger save draft");
      }
    };
  }, [selectedSession]);

  useEffect(() => {
    if (
      newChatMessage &&
      newChatMessage?.chat_session_id === selectedSession?.chat_session_id
    ) {
      appendMessage(newChatMessage);
    }
  }, [newChatMessage]);

  const renderMessageRows = useMemo(
    () =>
      messages.map((item) => {
        return (
          <MessageRow
            content={item?.content}
            isFromCurrentUser={
              item?.participant_id === currentUserParticipantId
            }
          />
        );
      }),
    [messages, currentUserParticipantId],
  );

  return (
    <div className="col-span-3 h-full flex flex-col">
      {selectedSession ? (
        <>
          <div className="flex justify-between border-b items-center px-4 py-4">
            <div>
              <h3 className="font-bold text-lg">
                {recepientDetails?.user.username}
              </h3>
              <span className="text-gray-400 text-sm">Active</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-sky-100 p-2 rounded-full hover:bg-sky-200">
                <Call />
              </button>
              <button className="bg-sky-100 p-2 rounded-full hover:bg-sky-200">
                <MenuOpen />
              </button>
            </div>
          </div>

          <div className="flex flex-grow basis-0 flex-col-reverse px-3 overflow-y-auto">
            {renderMessageRows}
          </div>

          <MessageComposer
            setMessage={setMessage}
            message={message}
            sendMessage={sendMessage}
            openMediaCapture={openMediaCaptureDialog}
            closeMediaCapture={closeMediaCaptureDialog}
            attachments={attachments}
          />

          <MediaCaptureDialog
            open={showMediaCapture}
            closeMediaCapture={closeMediaCaptureDialog}
            setAttachments={setAttachments}
          />
        </>
      ) : (
        <div className="flex text-3xl font-bold justify-center flex-col items-center flex-grow w-full bg-gray-50">
          No one to talk to?
          <p className="text-sm font-normal">
            Select a conversation to start a new chat.
          </p>
        </div>
      )}
    </div>
  );
}

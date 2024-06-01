import { MessageRowProps } from "../types";

export default function MessageRow({ content, isFromCurrentUser }: MessageRowProps) {

  return (
    <div className={`chat ${isFromCurrentUser ? "chat-end" : "chat-start"}`}>
      <div className="flex-grow" />
      <div className="hidden">Chat Actions</div>
      <div className={`py-2 px-4 chat-bubble text-gray-900 ${isFromCurrentUser ? 'bg-sky-200' : 'bg-gray-200'}`}>{content}</div>
    </div >
  )
}

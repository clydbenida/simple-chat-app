import { MessageRowProps } from "../types";

export default function MessageRow({ content, isFromCurrentUser }: MessageRowProps) {

  return (
    <div className={`flex my-2 items-center ${isFromCurrentUser ? "flex-row" : "flex-row-reverse"}`}>
      <div className="flex-grow" />
      <div className="hidden">Chat Actions</div>
      <div className={`py-2 px-4 rounded-2xl ${isFromCurrentUser ? 'bg-sky-200' : 'bg-gray-200'}`}>{content}</div>
    </div>
  )
}

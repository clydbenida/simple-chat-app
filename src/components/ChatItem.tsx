import profileUser from "../assets/profile-user.png";
import dots from "../assets/dots.png";
import { ChatItemProps } from "../types";

export default function ChatItem({ active, recentMessage, chatName, onClick }: ChatItemProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex flex-row justify-between items-center my-4 bg-gray-100 py-4 px-4 rounded-xl ${active ? 'bg-sky-100 hover:bg-sky-200' : 'hover:bg-gray-200'}`}
    >
      <div className="pl-3 pr-6"><img src={profileUser} width={64} /></div>
      <div className="flex-grow">
        <div className="font-bold">
          {chatName}
        </div>
        <div className="text-gray-400">
          {recentMessage}
        </div>
      </div>
      <div><img src={dots} width={32} /></div>
    </div>
  )
}

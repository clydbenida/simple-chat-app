import { useEffect, useMemo, useState } from "react";
import fetchAPI from "../api";
import { ChatSessionType, UserType } from "../types";
import Modal from "./CustomModal";

interface OnlineUsersDialogProps {
  showOnlineUsers: boolean;
  currentUser: UserType;
  handleCloseOnlineUsers: () => void;
  setSelectedSession: React.Dispatch<ChatSessionType | undefined>;
}

export default function OnlineUsersDialog({ showOnlineUsers, currentUser, handleCloseOnlineUsers, setSelectedSession }: OnlineUsersDialogProps) {
  const [onlineUsers, setOnlineUsers] = useState<UserType[]>([]);

  useEffect(() => {
    // API call for fetching user list
    async function fetchOnlineUsers() {
      const { data } = await fetchAPI("get", `/online-users?username=${currentUser?.username}`);

      if (data.length) {
        setOnlineUsers(data);
      }
    }

    fetchOnlineUsers();
  }, [showOnlineUsers, currentUser]);

  async function handleClickListItemButton(recipient_id: number) {
    const { data } = await fetchAPI("post", "/chat_session", { user_ids: [currentUser.user_id, recipient_id] });
    console.log("response data", data)
    if (data) {
      setSelectedSession(data);
      handleCloseOnlineUsers();
    }
  }

  const renderOnlineUserList = useMemo(
    () => onlineUsers.map(user => (
      <button className="menu py-4 rounded-md hover:bg-gray-50 w-full" onClick={() => handleClickListItemButton(user.user_id)}>
        {user.username}
      </button>
    )), [onlineUsers])

  return (
    <Modal show={showOnlineUsers} onHide={handleCloseOnlineUsers}>
      <div className="modal-box w-1/2 max-w-xl p-2">
        <input type="text" className="input input-lg w-full focus:outline-none focus:border-0" placeholder="Enter username..." />
        <div className="h-[15rem] overflow-y-scroll">
          {renderOnlineUserList}
        </div>
      </div>
    </Modal>
  );
}

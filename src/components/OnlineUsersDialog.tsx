import { Dialog, DialogContent, Divider, List, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import fetchAPI from "../api";
import { ChatSessionType, UserType } from "../types";

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
      <ListItemButton onClick={() => handleClickListItemButton(user.user_id)}>
        <ListItemText primary={user.username} />
      </ListItemButton>
    )), [onlineUsers])

  return (
    <Dialog open={showOnlineUsers} onClose={handleCloseOnlineUsers}>
      <DialogContent style={{ padding: 0 }}>
        <h4 className="py-5 px-10">Online Users</h4>
        <Divider />
        <List>
          {renderOnlineUserList}
        </List>
      </DialogContent>
    </Dialog>
  );
}

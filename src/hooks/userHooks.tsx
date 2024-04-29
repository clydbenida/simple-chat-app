import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { UserType } from "../types";

export function useUser() {
  const token = Cookies.get("token");
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
  }, [token]);

  return { token, user }
}

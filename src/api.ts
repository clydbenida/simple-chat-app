import { io } from "socket.io-client";
import Cookies from "js-cookie";

export const BACKEND_URL = "http://localhost:4000";

export const socket = io(BACKEND_URL);

export default async function fetchAPI(
  method: 'get' | 'post' | 'patch' | 'delete' | 'put',
  endpoint: string,
  data?: Record<string, unknown>
) {
  let config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${Cookies.get("token")}`
    }
  };

  if (method !== "get") {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, config)

  return response.json();
}

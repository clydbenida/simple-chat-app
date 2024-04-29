import { createBrowserRouter, redirect, useActionData } from "react-router-dom";
import Cookies from "js-cookie";
import App from "./pages/App";
import ChatPage from "./pages/ChatPage";
import ErrorPage from "./pages/ErrorPage";
import { BACKEND_URL } from "./api";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "chat",
    element: <ChatPage />,
    action: async ({ request }) => {
      try {
        const formData = await request.formData();
        const username = formData.get("username") as string;

        const response = await fetch(`${BACKEND_URL}/register`, {
          method: 'post',
          body: JSON.stringify({ username }),
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const parsedRes = await response.json();

        Cookies.set("token", parsedRes.data.token)
        localStorage.setItem("user", JSON.stringify(parsedRes.data.user));
        return parsedRes.data.user;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  }
])

export default router;

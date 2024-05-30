import { createBrowserRouter, redirect } from "react-router-dom";
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
    loader: async () => {
      try {
        const userFromLocal = localStorage.getItem("user");
        const token = Cookies.get("token");

        if (!token || !userFromLocal) {
          return redirect("/");
        }

        return JSON.parse(userFromLocal)
      } catch (err) {
        console.log(err);
        return err;
      }
    },
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
  },
  {
    path: "logout",
    action: async ({ request }) => {
      try {
        Cookies.remove("token");
        localStorage.removeItem("user");
        return redirect("/")
      } catch (err) {
        console.log(err)
      }
    }

  },
])

export default router;

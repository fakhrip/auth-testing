import { AuthContextType, IUser } from "../types/user";
import Cookies from "js-cookie";

export const authProvider: AuthContextType = {
  user: {
    username: Cookies.get("username"),
    token: Cookies.get("tokencookie"),
    idToken: Cookies.get("idtokencookie"),
    isAuthenticated:
      Cookies.get("idtokencookie") != undefined &&
      Cookies.get("idtokencookie") != "",
  },
  updateUser(user: IUser) {
    authProvider.user = user;

    if (user.username != undefined) {
      Cookies.set("username", user.username);
    }

    if (user.token != undefined) {
      Cookies.set("tokencookie", user.token);
    }

    if (user.idToken != undefined) {
      Cookies.set("idtokencookie", user.idToken);
    }
  },
};

export async function createAccount(username: string, password: string) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: { username, password },
      }),
    }
  );

  return {
    jsonResponse: await rawResponse.json(),
    responseCode: rawResponse.status,
  };
}

export async function loginAccount(username: string, password: string) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users/login`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: { username, password },
      }),
    }
  );

  return {
    jsonResponse: await rawResponse.json(),
    responseCode: rawResponse.status,
  };
}

export async function deleteAccount(idToken: string) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/users/delete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return {
    jsonResponse: await rawResponse.json(),
    responseCode: rawResponse.status,
  };
}

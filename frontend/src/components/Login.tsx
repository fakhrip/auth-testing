import { LoaderFunctionArgs, redirect, useActionData, useFetcher, useNavigation } from "react-router-dom";
import { useAuth } from "../AuthContext"
import { AuthContextType } from "../types/user"
import { loginAccount } from "../util/auth";
import { loginFirebase } from "../util/firebase";

export function LoginLayout() {
  let fetcher = useFetcher();

  let navigation = useNavigation();
  let isSigningUp = navigation.formData?.get("username") != null || navigation.formData?.get("password") != null;

  let actionData = useActionData() as { error: string } | undefined;

  return (
    <div>
      Login
      <fetcher.Form method="post" action="/users/login">
        <label>
          Username: <input name="username" />
        </label>
        <label>
          Password: <input name="password" />
        </label>
        <button type="submit" disabled={isSigningUp}>
          {isSigningUp ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </fetcher.Form>
    </div>
  )
}

export function LoginLoader() {
  const { user } = useAuth() as AuthContextType

  if (user.isAuthenticated) {
    return redirect("/home")
  }

  return null
}

export async function LoginAction({ request }: LoaderFunctionArgs) {
  const { updateUser } = useAuth() as AuthContextType
  let formData = await request.formData();

  let username = formData.get("username") as string | null;
  let password = formData.get("password") as string | null;

  if (!username) {
    return {
      error: "You must provide a username to login",
    };
  }

  if (!password) {
    return {
      error: "You must provide a password to login",
    };
  }

  try {
    const response = await loginAccount(username, password)
    if (response.responseCode === 200) {
      updateUser({
        username: response.jsonResponse.username,
        token: response.jsonResponse.token,
        ...await loginFirebase(response.jsonResponse.token)
      })

      return redirect("/home");
    }

    return {
      error: response.jsonResponse.message.errors ?? response.jsonResponse.message ?? response.jsonResponse,
    };
  } catch (error) {
    return {
      error,
    };
  }
}
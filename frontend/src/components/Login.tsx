import { LoaderFunctionArgs, redirect, useActionData, useFetcher, useNavigation, Link } from "react-router-dom";
import { authProvider, loginAccount } from "../util/auth";
import { loginFirebase } from "../util/firebase";

export function LoginLayout() {
  let fetcher = useFetcher();

  let navigation = useNavigation();
  let isSigningUp = navigation.formData?.get("username") != null || navigation.formData?.get("password") != null;

  let actionData = fetcher.data as { error: string } | undefined;

  return (
    <div>
      Login
      <fetcher.Form method="post" action="/login">
        <label>
          Username: <input name="username" />
        </label> <br />
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

      <br />
      <Link to="/signup">Go to Signup Page</Link>
    </div>
  )
}

export function LoginLoader() {
  const { user } = authProvider;

  if (user.isAuthenticated) {
    return redirect("/")
  }

  return null
}

export async function LoginAction({ request }: LoaderFunctionArgs) {
  const { updateUser } = authProvider;
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
    if (response.responseCode < 300) {
      updateUser({
        username: response.jsonResponse.user.username,
        token: response.jsonResponse.user.token,
        ...await loginFirebase(response.jsonResponse.user.token)
      })

      return redirect("/");
    }

    return {
      error: JSON.stringify(response.jsonResponse.errors ?? response.jsonResponse.message ?? response.jsonResponse)
    };
  } catch (error) {
    return {
      error,
    };
  }
}
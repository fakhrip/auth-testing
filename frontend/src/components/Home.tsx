import { redirect, useActionData, useFetcher } from "react-router-dom";
import { authProvider } from "../util/auth";

export function HomeLayout() {
  const { user } = authProvider;

  let deleteFetcher = useFetcher();
  let logoutFetcher = useFetcher();
  let isDeletingAccount = deleteFetcher.formData != null;
  let isLoggingOut = logoutFetcher.formData != null;

  let actionData = (deleteFetcher.data ?? logoutFetcher.data) as { error: string } | undefined;

  return (
    <div>
      Hello {user.username}, welcome to your homepage!

      <br />
      <deleteFetcher.Form method="post" action="/delete">
        <button type="submit" disabled={isDeletingAccount}>
          {isDeletingAccount ? "Deleting account..." : "Delete account"}
        </button>
      </deleteFetcher.Form>

      <br />
      <logoutFetcher.Form method="post" action="/logout">
        <button type="submit" disabled={isLoggingOut}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </logoutFetcher.Form>

      <br />
      {actionData && actionData.error ? (
        <p style={{ color: "red" }}>{actionData.error}</p>
      ) : null}
    </div>
  )
}

export function HomeLoader() {
  const { user } = authProvider;

  if (!user.isAuthenticated) {
    return redirect("/login")
  }

  return null
}
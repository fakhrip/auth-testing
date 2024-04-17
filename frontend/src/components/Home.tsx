import { redirect, useActionData, useFetcher, useNavigation } from "react-router-dom";
import { useAuth } from "../AuthContext"
import { AuthContextType } from "../types/user"

export function HomeLayout() {
  const { user } = useAuth() as AuthContextType

  let fetcher = useFetcher();
  let isDeletingAccount = fetcher.formData != null;
  let actionData = useActionData() as { error: string } | undefined;

  return (
    <div>
      Hello {user.username}, welcome to your homepage!
      <fetcher.Form method="post" action="/delete">
        <button type="submit" disabled={isDeletingAccount}>
          {isDeletingAccount ? "Deleting account..." : "Delete account"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </fetcher.Form>
    </div>
  )
}

export function HomeLoader() {
  const { user } = useAuth() as AuthContextType

  if (!user.isAuthenticated) {
    return redirect("/login")
  }

  return null
}
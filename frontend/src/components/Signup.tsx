import { LoaderFunctionArgs, redirect, useActionData, useFetcher, useNavigation, Link } from "react-router-dom";
import { authProvider, createAccount } from "../util/auth";
import { loginFirebase } from "../util/firebase";

export function SignupLayout() {
  let fetcher = useFetcher();

  let navigation = useNavigation();
  let isSigningUp = navigation.formData?.get("username") != null || navigation.formData?.get("password") != null;

  let actionData = useActionData() as { error: string } | undefined;

  return (
    <div>
      Signup
      <fetcher.Form method="post" action="/signup">
        <label>
          Username: <input name="username" />
        </label> <br />
        <label>
          Password: <input name="password" />
        </label>
        <button type="submit" disabled={isSigningUp}>
          {isSigningUp ? "Creating account..." : "Create account"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </fetcher.Form>

      <br />
      <Link to="/login">Go to Login Page</Link>
    </div>
  )
}

export function SignupLoader() {
  // Our root route always provides the user, if logged in
  // TODO: change this to use data from firebase client
  return { user: "test" };
}

export async function SignupAction({ request }: LoaderFunctionArgs) {
  const { updateUser } = authProvider;
  let formData = await request.formData();

  let username = formData.get("username") as string | null;
  let password = formData.get("password") as string | null;

  if (!username) {
    return {
      error: "You must provide a username to signup",
    };
  }

  if (!password) {
    return {
      error: "You must provide a password to signup",
    };
  }

  try {
    const response = await createAccount(username, password)
    if (response.responseCode === 200) {
      updateUser({
        username: response.jsonResponse.username,
        token: response.jsonResponse.token,
        ...await loginFirebase(response.jsonResponse.token)
      })

      return redirect("/");
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
export function SignupLayout() {
  return (
    <div>
      Signup
    </div>
  )
}

export function SignupLoader() {
  // Our root route always provides the user, if logged in
  // TODO: change this to use data from firebase client
  return { user: "test" };
}

export function SignupAction() {
  // TODO: create user account
  return false
}
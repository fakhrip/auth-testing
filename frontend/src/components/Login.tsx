import { redirect } from "react-router-dom"
import { useAuth } from "../AuthContext"
import { AuthContextType } from "../types/user"

export function LoginLayout() {
  return (
    <div>
      Login
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

export function LoginAction() {
  // TODO: log the user in
  return false
}
import { redirect } from "react-router-dom"
import { useAuth } from "../AuthContext"
import { AuthContextType } from "../types/user"

export function HomeLayout() {
  const { user } = useAuth() as AuthContextType

  return (
    <div>
      Hello {user.username}, welcome to your homepage!
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
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { LoginAction, LoginLayout, LoginLoader } from './components/Login';
import { HomeLayout, HomeLoader } from './components/Home';
import { SignupAction, SignupLayout, SignupLoader } from './components/Signup';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthContextType } from './types/user';
import { deleteAccount } from './util/auth';
import { logoutFirebase } from './util/firebase';

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    action: SignupAction,
    loader: SignupLoader,
    Component: SignupLayout,
    children: [
      {
        path: "login",
        action: LoginAction,
        loader: LoginLoader,
        Component: LoginLayout,
      },
      {
        path: "home",
        loader: HomeLoader,
        Component: HomeLayout,
      },
      {
        path: "delete",
        loader: HomeLoader,
        async action() {
          const { user, updateUser } = useAuth() as AuthContextType

          try {
            const response = await deleteAccount(user.idToken!)
            if (response.responseCode === 200) {
              updateUser({
                id: "",
                username: "",
                token: "",
                idToken: "",
                isAuthenticated: false
              })

              await logoutFirebase();
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
        },
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      const { updateUser } = useAuth() as AuthContextType

      if (await logoutFirebase()) {
        updateUser({
          id: "",
          username: "",
          token: "",
          idToken: "",
          isAuthenticated: false
        })
      }

      return redirect("/");
    },
  },
]);


export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </AuthProvider>
  );
}

import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { LoginAction, LoginLayout, LoginLoader } from './components/Login';
import { HomeLayout, HomeLoader } from './components/Home';
import { SignupAction, SignupLayout, SignupLoader } from './components/Signup';
import { authProvider, deleteAccount } from './util/auth';
import { logoutFirebase } from './util/firebase';

const router = createBrowserRouter([
  {
    id: "home",
    path: "/",
    loader: HomeLoader,
    Component: HomeLayout,
  },
  {
    path: "/login",
    action: LoginAction,
    loader: LoginLoader,
    Component: LoginLayout,
  },
  {
    path: "/signup",
    action: SignupAction,
    loader: SignupLoader,
    Component: SignupLayout,
  },
  {
    path: "/delete",
    loader: HomeLoader,
    async action() {
      const { user, updateUser } = authProvider

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
  {
    path: "/logout",
    async action() {
      const { updateUser } = authProvider

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
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

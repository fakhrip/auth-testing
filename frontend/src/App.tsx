import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { LoginAction, LoginLayout, LoginLoader } from './components/Login';
import { HomeLayout, HomeLoader } from './components/Home';
import { SignupAction, SignupLayout, SignupLoader } from './components/Signup';
import { Context, createContext, useState } from 'react';

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
        loader: LoginLoader,
        action() {
          // TODO: add delete functionality
          return false
        },
        Component() {
          return (
            <div>
              test
            </div>
          )
        },
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      // TODO: add logout functionality
      return redirect("/");
    },
  },
]);

const AuthContext: Context<User> = createContext<User>({
  isAuthenticated: false
})

export default function App() {
  const [authenticatedUser] = useState<User>({
    isAuthenticated: false
  });

  return (
    <AuthContext.Provider value={authenticatedUser}>
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </AuthContext.Provider>
  );
}

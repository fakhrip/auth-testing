import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { IUser } from "../types/user";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth();

export const loginFirebase = async (customToken: string): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    signInWithCustomToken(firebaseAuth, customToken)
      .then((userCredential) => {
        userCredential.user
          .getIdToken(true)
          .then((idToken) => {
            resolve({
              id: userCredential.user.uid,
              idToken,
              isAuthenticated: true,
            });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logoutFirebase = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    signOut(firebaseAuth)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

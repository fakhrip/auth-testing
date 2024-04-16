export interface IUser {
  id?: string;
  username?: string;
  token?: string;
  idToken?: string;
  isAuthenticated: boolean;
}

export type AuthContextType = {
  user: IUser;
  updateUser: (user: IUser) => void;
};

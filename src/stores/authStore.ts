import { create } from "zustand";
import Cookies from "js-cookie";
import { getAuth } from "firebase/auth";

import { Log } from "@/utils";
import { NotifyLogin } from "@/utils/notifyLogin";
import { nexys } from "@/utils/nexys";
import type { UserTypes } from "@/types";
import type { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  validatedUser: UserTypes | null;
  authLoading: boolean;
  actions: {
    signin: (user: any) => void;
    signout: () => void;
    setValidatedUser: (user: UserTypes) => void;
    setUser: (user: any) => void;
    setLoading: (loading: boolean) => void;
    refreshToken: (force: boolean) => void;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  validatedUser: null,
  authLoading: true,
  actions: {
    signin: async function (user: User) {
      const idToken = await user.getIdToken();
      Cookies.set("auth", idToken);
      await NotifyLogin(idToken);
      nexys.log(user, { action: "LOGIN" });
      set({ user });
    },
    signout: async function () {
      set({ authLoading: true });
      nexys.log(useAuthStore.getState().user, { action: "SIGNOUT" });
      const auth = getAuth();
      await auth.signOut();
      Cookies.remove("auth");
      set({ user: null, authLoading: false });
    },
    setValidatedUser: function (user: UserTypes) {
      set({ validatedUser: user });
    },
    setUser: function (user: User) {
      nexys.configure((config) => config.setUser(user?.email ?? ""));
      set({ user });
    },
    setLoading: function (loading: boolean) {
      set({ authLoading: loading });
    },
    refreshToken: async function (force: boolean) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          await user.getIdToken(force);
        } catch (error) {
          Log.error(error);
        }
      }
    },
  },
}));

export const signin = useAuthStore.getState().actions.signin;
export const signout = useAuthStore.getState().actions.signout;
export const setUser = useAuthStore.getState().actions.setUser;
export const setValidatedUser =
  useAuthStore.getState().actions.setValidatedUser;
export const setLoading = useAuthStore.getState().actions.setLoading;
export const refreshToken = useAuthStore.getState().actions.refreshToken;

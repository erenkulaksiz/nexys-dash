import { create } from "zustand";
import Cookies from "js-cookie";
import { getAuth } from "firebase/auth";

import { Log } from "@/utils";
import type { UserTypes } from "@/types";

interface AuthState {
  user: any;
  validatedUser: UserTypes | null;
  authLoading: boolean;
  actions: {
    signin: (user: any) => void;
    signout: () => void;
    setValidatedUser: (user: UserTypes) => void;
    setUser: (user: any) => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  validatedUser: null,
  authLoading: false,
  actions: {
    signin: function (user: any) {
      Cookies.set("auth", user.accessToken);
      set({ user });
    },
    signout: async function () {
      set({ authLoading: true });
      const auth = getAuth();
      await auth.signOut();
      Cookies.remove("auth");
      set({ user: null, authLoading: false });
    },
    setValidatedUser: function (user: UserTypes) {
      Log.debug("setValidatedUser:", user);
      set({ validatedUser: user });
    },
    setUser: function (user: any) {
      Log.debug("setUser:", user);
      set({ user });
    },
    setLoading: function (loading: boolean) {
      Log.debug("setLoading:", loading);
      set({ authLoading: loading });
    },
  },
}));

export const signin = useAuthStore.getState().actions.signin;
export const signout = useAuthStore.getState().actions.signout;
export const setUser = useAuthStore.getState().actions.setUser;
export const setValidatedUser =
  useAuthStore.getState().actions.setValidatedUser;
export const setLoading = useAuthStore.getState().actions.setLoading;

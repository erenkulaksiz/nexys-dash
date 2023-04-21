import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { setLoading } from "@/stores/authStore";

import { Log } from "./logger";

export interface signinParams {
  email: string;
  password: string;
}

export interface signinReturnTypes {
  success: boolean;
  user?: any;
  token?: string;
  error?: any;
}

export async function signin({email, password}: signinParams): Promise<signinReturnTypes> {
  const auth = getAuth();
  const provider = new EmailAuthProvider();

  if (!provider)
    return {
      success: false,
      error: {
        errorMessage: "no-auth",
        errorCode: "no-auth",
      },
    };

  setLoading(true);

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )
    .then(async (result) => {
      const { user } = result;
      const token = await user?.getIdToken();

      setLoading(false);

      return { success: true, user, token };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Log.error("Login auth error, utils/signin");

      setLoading(false);

      return { success: false,  error: { errorCode, errorMessage } };
    });

  return userCredential;
}
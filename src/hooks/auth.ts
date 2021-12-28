import auth from "@react-native-firebase/auth";
import { useCallback } from "react";
import { useToast } from "react-native-toast-notifications";

export const useSignUp = () => {
  const toast = useToast();

  const registerUser = useCallback(
    async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      try {
        const {
          user: firebaseUser,
        } = await auth().createUserWithEmailAndPassword(email, password);
        const token = await firebaseUser.getIdToken();
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.show("メールアドレスは既に使用されています", {
            type: "danger",
          });
          return;
        }

        if (error.code === "auth/invalid-email") {
          toast.show("無効なアドレスです", { type: "danger" });
          return;
        }

        if (error.code === "auth/weak-password") {
          toast.show("パスワードは8文字以上にしてください");
          return;
        }

        toast.show("何らかのエラーが発生しました", { type: "danger" });
      }
    },
    []
  );

  return {
    registerUser,
  };
};

import auth from "@react-native-firebase/auth";
import { useCallback } from "react";
import { useToast } from "react-native-toast-notifications";
import { useCreateUserMutation } from "src/generated/graphql";
import { appleAuth } from "@invertase/react-native-apple-authentication";

export const useSignUpWithEmail = () => {
  const toast = useToast();
  const [_, createUserMutation] = useCreateUserMutation();

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
        const idToken = await firebaseUser.getIdToken();
        const response = await createUserMutation({
          input: {
            name,
            email,
            idToken,
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
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

export const useSignupWithApple = () => {
  const toast = useToast();

  const signupWithApple = useCallback(async () => {
    console.log("✋run");
    const appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGOUT,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log("✋response ok");

    console.log(appleAuthResponse.user);

    if (!appleAuthResponse.identityToken) {
      console.log("✋error");
      toast.show("何かしらのエラーが発生しました", { type: "danger" });
      return;
    }

    console.log("✋token ok");

    const { identityToken, nonce } = appleAuthResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    const result = await auth().signInWithCredential(appleCredential);
    console.log(result.user);
  }, [toast]);

  return {
    signupWithApple,
  };
};

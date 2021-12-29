import auth from "@react-native-firebase/auth";
import { useCallback } from "react";
import { useToast } from "react-native-toast-notifications";
import { useCreateUserMutation } from "src/generated/graphql";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Config from "react-native-config";

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

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
    const appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGOUT,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthResponse.identityToken) {
      toast.show("何かしらのエラーが発生しました", { type: "danger" });
      return;
    }

    const { identityToken, nonce } = appleAuthResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    const result = await auth().signInWithCredential(appleCredential);

    // ToDo mutation
  }, [toast]);

  return {
    signupWithApple,
  };
};

export const useSignupWithGoogle = () => {
  const [userData, createUserMutation] = useCreateUserMutation();

  const signupWithGoogle = useCallback(async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const googleResult = await auth().signInWithCredential(googleCredential);
      const userIdToken = await googleResult.user.getIdToken();
      const response = await createUserMutation({
        input: {
          email: googleResult.user.email,
          idToken: userIdToken,
          name: googleResult.user.displayName,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    signupWithGoogle,
  };
};

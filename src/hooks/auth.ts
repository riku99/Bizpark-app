import auth from "@react-native-firebase/auth";
import { useCallback } from "react";
import { useToast } from "react-native-toast-notifications";
import {
  useCreateUserMutation,
  useInitialDataLazyQuery,
  useSignOutMutation,
} from "src/generated/graphql";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Config from "react-native-config";
import { googleSignIn } from "src/helpers/auth";
import { setMeVarWithInitialData } from "src/helpers/stores";
import { Alert } from "react-native";
import { useSomeErrorToast } from "./toast";
import { spinnerVisibleVar } from "src/stores/spinner";
import { useApolloClient } from "@apollo/client";
import { storageKeys, setMeVar } from "src/stores/me";
import AsyncStorage from "@react-native-async-storage/async-storage";

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

export const useSignUpWithEmail = () => {
  const toast = useToast();
  const { someErrorToast } = useSomeErrorToast();
  const [createUserMutation] = useCreateUserMutation();

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
      spinnerVisibleVar(true);
      try {
        const {
          user: firebaseUser,
        } = await auth().createUserWithEmailAndPassword(email, password);
        const idToken = await firebaseUser.getIdToken();
        try {
          const { data } = await createUserMutation({
            variables: {
              input: {
                name,
                email,
                idToken,
              },
            },
          });
          setMeVarWithInitialData(data.createUser);
        } catch (e) {
          console.log(e);
        }
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

        someErrorToast();
      } finally {
        spinnerVisibleVar(false);
      }
    },
    [someErrorToast]
  );

  return {
    registerUser,
  };
};

export const useSignupWithApple = () => {
  const { someErrorToast } = useSomeErrorToast();
  const [createUserMutation] = useCreateUserMutation();

  const signupWithApple = useCallback(async () => {
    try {
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGOUT,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthResponse.identityToken) {
        someErrorToast();
        return;
      }

      const { identityToken, nonce } = appleAuthResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      const result = await auth().signInWithCredential(appleCredential);
      const userIdToken = await result.user.getIdToken();

      const { data } = await createUserMutation({
        variables: {
          input: {
            email: result.user.email,
            idToken: userIdToken,
            name: result.user.displayName,
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  }, [someErrorToast]);

  return {
    signupWithApple,
  };
};

export const useSignupWithGoogle = () => {
  const [createUserMutation] = useCreateUserMutation();
  const { someErrorToast } = useSomeErrorToast();

  const signupWithGoogle = useCallback(async () => {
    spinnerVisibleVar(true);
    try {
      const { googleData, idToken } = await googleSignIn();
      const { data } = await createUserMutation({
        variables: {
          input: {
            email: googleData.user.email,
            idToken,
            name: googleData.user.displayName,
          },
        },
      });
      setMeVarWithInitialData(data.createUser);
    } catch (e) {
      console.log(e);
    } finally {
      spinnerVisibleVar(false);
    }
  }, [someErrorToast]);

  return {
    signupWithGoogle,
  };
};

export const useSignInWithEmail = () => {
  const [getInitialData, { called }] = useInitialDataLazyQuery();

  const signInWithEmail = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      spinnerVisibleVar(true);
      try {
        await auth().signInWithEmailAndPassword(email, password);
        try {
          if (!called) {
            const { data } = await getInitialData();
            if (data) {
              setMeVarWithInitialData(data.initialData.me);
            }
          }
        } catch (e) {}
      } catch (e) {
        Alert.alert("エラー", "メールアドレスまたはパスワードが間違っています");
      } finally {
        spinnerVisibleVar(false);
      }
    },
    []
  );

  return {
    signInWithEmail,
  };
};

export const useSignInWithGoogle = () => {
  const [getInitialData, { called }] = useInitialDataLazyQuery();

  const signInWithGoogle = useCallback(async () => {
    spinnerVisibleVar(true);
    try {
      await googleSignIn();
      if (!called) {
        const { data } = await getInitialData();
        if (data) {
          setMeVarWithInitialData(data.initialData.me);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      spinnerVisibleVar(false);
    }
  }, []);

  return {
    signInWithGoogle,
  };
};

export const useSignOut = () => {
  const client = useApolloClient();
  const [signOutMutation] = useSignOutMutation();

  const signOut = useCallback(async () => {
    spinnerVisibleVar(true);
    try {
      await signOutMutation();
      await auth().signOut();
    } catch (e) {
    } finally {
      // tryのプロセスでエラー出てもログアウトさせるのでfinalltに記述
      setMeVar({
        loggedIn: false,
        id: null,
        name: null,
        bio: null,
        imageUrl: null,
      });

      await AsyncStorage.removeItem(storageKeys.id);
      await AsyncStorage.removeItem(storageKeys.name);
      await AsyncStorage.setItem(storageKeys.loggedIn, JSON.stringify(false));

      await client.clearStore();

      console.log("👋 Sign out success!");

      spinnerVisibleVar(false);
    }
  }, [client]);

  return {
    signOut,
  };
};

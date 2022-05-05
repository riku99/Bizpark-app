import { useApolloClient } from '@apollo/client';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { useToast } from 'react-native-toast-notifications';
import {
  useCreateUserMutation,
  useInitialDataLazyQuery,
  useSignOutMutation,
} from 'src/generated/graphql';
import { googleSignIn } from 'src/helpers/auth';
import { useLoggedIn } from 'src/hooks/me';
import { storage } from 'src/storage/mmkv';
import { spinnerVisibleVar } from 'src/stores/spinner';
import { useCustomToast } from './toast';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

export const useSignUpWithEmail = () => {
  const { setLoggedIn } = useLoggedIn();

  const toast = useToast();
  const { someErrorToast } = useCustomToast();
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
        const { user: firebaseUser } =
          await auth().createUserWithEmailAndPassword(email, password);
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

          if (data) {
            setLoggedIn(true);
          }
        } catch (e) {
          console.log(e);
        }
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
          toast.show('メールアドレスは既に使用されています', {
            type: 'danger',
          });
          return;
        }

        if (error.code === 'auth/invalid-email') {
          toast.show('無効なアドレスです', { type: 'danger' });
          return;
        }

        if (error.code === 'auth/weak-password') {
          toast.show('パスワードは8文字以上にしてください');
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
  const { setLoggedIn } = useLoggedIn();

  const { someErrorToast } = useCustomToast();
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

      if (data) {
        setLoggedIn(true);
      }
    } catch (e) {
      console.log(e);
    }
  }, [someErrorToast]);

  return {
    signupWithApple,
  };
};

export const useSignupWithGoogle = () => {
  const { setLoggedIn } = useLoggedIn();

  const [createUserMutation] = useCreateUserMutation();
  const { someErrorToast } = useCustomToast();

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

      if (data) {
        setLoggedIn(true);
      }
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
  const { setLoggedIn } = useLoggedIn();

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
              setLoggedIn(true);
            }
          }
        } catch (e) {}
      } catch (e) {
        Alert.alert('エラー', 'メールアドレスまたはパスワードが間違っています');
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
  const { setLoggedIn } = useLoggedIn();

  const [getInitialData, { called }] = useInitialDataLazyQuery();

  const signInWithGoogle = useCallback(async () => {
    spinnerVisibleVar(true);
    try {
      await googleSignIn();
      if (!called) {
        const { data } = await getInitialData();
        if (data) {
          setLoggedIn(true);
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
  const { setLoggedIn } = useLoggedIn();

  const client = useApolloClient();
  const [signOutMutation] = useSignOutMutation();

  const signOut = useCallback(async () => {
    try {
      await signOutMutation();
    } catch (e) {
      console.log(e);
    } finally {
      await Promise.all([
        auth().signOut(),
        client.clearStore(),
        AsyncStorage.clear(),
      ]);

      storage.clearAll();

      setLoggedIn(false);

      console.log('👋 Sign out success!');
    }
  }, [client]);

  return {
    signOut,
  };
};

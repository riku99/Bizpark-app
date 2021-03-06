import { useApolloClient } from '@apollo/client';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import Config from 'react-native-config';
import { useToast } from 'react-native-toast-notifications';
import { loginProviders } from 'src/constants';
import {
  useCreateUserMutation,
  useInitialDataLazyQuery,
  useMeLazyQuery,
  useSignOutMutation
} from 'src/generated/graphql';
import { appleSignIn, googleSignIn } from 'src/helpers/auth';
import { useLoggedIn } from 'src/hooks/me';
import { useSpinner } from 'src/hooks/spinner';
import { mmkvStorageKeys, storage } from 'src/storage/mmkv';
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
            storage.set(
              mmkvStorageKeys.loginProvider,
              loginProviders.mailAddress
            );
          }
        } catch (e) {
          console.log(e);
        }
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
          toast.show('??????????????????????????????????????????????????????', {
            type: 'danger',
          });
          return;
        }

        if (error.code === 'auth/invalid-email') {
          toast.show('???????????????????????????', { type: 'danger' });
          return;
        }

        if (error.code === 'auth/weak-password') {
          toast.show('??????????????????8?????????????????????????????????');
          return;
        }

        someErrorToast();
      } finally {
        spinnerVisibleVar(false);
      }
    },
    [someErrorToast, createUserMutation, setLoggedIn, toast]
  );

  return {
    registerUser,
  };
};

export const useSignupWithApple = () => {
  const { setLoggedIn } = useLoggedIn();
  const { setSpinnerVisible } = useSpinner();
  const [createUserMutation] = useCreateUserMutation();
  const [meQuery] = useMeLazyQuery({
    fetchPolicy: 'no-cache',
  });
  const [getInitialData] = useInitialDataLazyQuery();

  const signupWithApple = useCallback(async () => {
    setSpinnerVisible(true);
    try {
      const { appleData, idToken, name } = await appleSignIn();

      const { data: meData } = await meQuery();

      if (!meData.me) {
        const { data } = await createUserMutation({
          variables: {
            input: {
              email: appleData.user.email,
              name: name ?? '??????',
              idToken,
            },
          },
        });

        if (data) {
          setLoggedIn(true);
          storage.set(mmkvStorageKeys.loginProvider, loginProviders.apple);
        }
      } else {
        const { data } = await getInitialData();

        if (data) {
          setLoggedIn(true);
          storage.set(mmkvStorageKeys.loginProvider, loginProviders.apple);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSpinnerVisible(false);
    }
  }, [
    createUserMutation,
    setLoggedIn,
    setSpinnerVisible,
    getInitialData,
    meQuery,
  ]);

  return {
    signupWithApple,
  };
};

export const useSignupWithGoogle = () => {
  const { setLoggedIn } = useLoggedIn();

  const [createUserMutation] = useCreateUserMutation();
  const [getInitialData] = useInitialDataLazyQuery();
  const [meQuery] = useMeLazyQuery({
    fetchPolicy: 'no-cache',
  });

  const signupWithGoogle = useCallback(async () => {
    spinnerVisibleVar(true);
    try {
      const { googleData, idToken } = await googleSignIn();

      const { data: meData } = await meQuery();

      if (!meData.me) {
        await createUserMutation({
          variables: {
            input: {
              email: googleData.user.email,
              idToken,
              name: googleData.user.displayName,
            },
          },
        });

        setLoggedIn(true);
        storage.set(mmkvStorageKeys.loginProvider, loginProviders.google);
      } else {
        await getInitialData();
        setLoggedIn(true);
        storage.set(mmkvStorageKeys.loginProvider, loginProviders.google);
      }
    } catch (e) {
      console.log(e);
    } finally {
      spinnerVisibleVar(false);
    }
  }, [createUserMutation, setLoggedIn, getInitialData, meQuery]);

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
              storage.set(
                mmkvStorageKeys.loginProvider,
                loginProviders.mailAddress
              );
            }
          }
        } catch (e) {}
      } catch (e) {
        Alert.alert('?????????', '?????????????????????????????????????????????????????????????????????');
      } finally {
        spinnerVisibleVar(false);
      }
    },
    [called, getInitialData, setLoggedIn]
  );

  return {
    signInWithEmail,
  };
};

export const useSignOut = () => {
  const { setLoggedIn } = useLoggedIn();

  const client = useApolloClient();
  const [signOutMutation] = useSignOutMutation();

  const signOut = useCallback(async () => {
    try {
      const firebaseUser = auth().currentUser;

      // ????????????????????????useSignOut?????????????????????sign out?????????????????????????????????????????????
      // ??????????????????????????????firebaseUser????????????????????????????????????????????????
      if (!firebaseUser) {
        return;
      }

      await signOutMutation();
    } catch (e) {
      console.log(e);
    } finally {
      await Promise.all([
        auth().signOut(),
        client.clearStore(),
      ]);

      storage.clearAll();

      setLoggedIn(false);

      console.log('???? Sign out success!');
    }
  }, [client, setLoggedIn, signOutMutation]);

  return {
    signOut,
  };
};

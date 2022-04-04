import {
  useGetMyIdQuery,
  useGetMyNameQuery,
  useGetMyImageUrlQuery,
  useGetMyPlanQuery,
  Plan,
} from 'src/generated/graphql';
import { useCallback, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { loggedInVar, STORAGE_KEY } from 'src/stores/loggedIn';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLoggedIn = () => {
  const loggedIn = useReactiveVar(loggedInVar.loggedIn);
  const checkedStorage = useReactiveVar(loggedInVar.checkedStorage);

  useEffect(() => {
    (async () => {
      if (!checkedStorage) {
        const l = await AsyncStorage.getItem(STORAGE_KEY);

        if (l) {
          loggedInVar.loggedIn(JSON.parse(l));
        }

        loggedInVar.checkedStorage(true);
      }
    })();
  }, [checkedStorage]);

  const setLoggedIn = useCallback(async (v: boolean) => {
    loggedInVar.loggedIn(v);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  }, []);

  return {
    loggedIn,
    setLoggedIn,
    checkedStorage,
  };
};

export const useMyId = () => {
  const { data } = useGetMyIdQuery({
    fetchPolicy: 'cache-only',
  });

  if (!data) {
    return null;
  }

  return data.me.id;
};

export const useMyName = () => {
  const { data } = useGetMyNameQuery();

  if (!data) {
    return null;
  }

  return data.me.name;
};

export const useMyImageUrl = () => {
  const { data } = useGetMyImageUrlQuery();

  if (!data) {
    return null;
  }

  return data.me.imageUrl;
};

export const useIsMe = () => {
  const myId = useMyId();

  const isMe = useCallback(
    ({ userId }: { userId: string }) => {
      if (!myId) {
        return false;
      }

      return myId === userId;
    },
    [myId]
  );

  return {
    isMe,
  };
};

export const useIsPlusPlan = () => {
  const { data } = useGetMyPlanQuery();

  return data?.me && data.me.plan === Plan.Plus;
};

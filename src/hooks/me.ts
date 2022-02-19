import {
  useGetMyIdQuery,
  useGetMyNameQuery,
  useGetMyImageUrlQuery,
} from 'src/generated/graphql';
import { useCallback, useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';
import { meVar, storageKeys } from 'src/stores/me';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLoggedIn = () => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
  const checkedStorage = useReactiveVar(meVar.checkedStorage);

  useEffect(() => {
    (async () => {
      if (!checkedStorage) {
        const l = await AsyncStorage.getItem(storageKeys.loggedIn);

        if (l) {
          meVar.loggedIn(JSON.parse(l));
        }

        meVar.checkedStorage(true);
      }
    })();
  }, [checkedStorage]);

  const setLoggedIn = useCallback(async (v: boolean) => {
    meVar.loggedIn(v);
    await AsyncStorage.setItem(storageKeys.loggedIn, JSON.stringify(v));
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

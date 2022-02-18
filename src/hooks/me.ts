import {
  useGetMyIdQuery,
  useGetMyNameQuery,
  useGetMyImageUrlQuery,
  useGetLoggedInQuery,
} from 'src/generated/graphql';
import { useCallback } from 'react';

export const useLoggedIn = () => {
  const { data } = useGetLoggedInQuery();

  if (!data) {
    return null;
  }

  return data.me.loggedIn;
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

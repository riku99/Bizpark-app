import { useGetMyIdQuery } from 'src/generated/graphql';
import { useCallback } from 'react';

const useMyId = () => {
  const { data } = useGetMyIdQuery();

  if (!data) {
    return null;
  }

  return data.me.id;
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

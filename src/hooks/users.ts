import { gql, useApolloClient } from "@apollo/client";
import { useCallback } from "react";
import {
  UserPartsFragmentDoc,
  UserPartsFragment,
  useFollowMutation,
  useUnfollowMutation,
  useUnBlockMutation,
  BlockingUsersDocument,
  BlockingUsersQueryResult,
  useBlockMutation,
} from "src/generated/graphql";

export const useUserCacheFragment = () => {
  const { cache } = useApolloClient();
  const readUserFragment = useCallback(
    ({ id }: { id: string }) => {
      const data = cache.readFragment<UserPartsFragment>({
        id: cache.identify({
          __typename: "User",
          id,
        }),
        fragment: UserPartsFragmentDoc,
      });

      return data;
    },
    [cache]
  );

  return {
    readUserFragment,
  };
};

export const useFollow = ({ followeeId }: { followeeId: string }) => {
  const mutation = useFollowMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: "User",
          id: followeeId,
        }),
        fragment: gql`
          fragment UserFollow on User {
            follow
          }
        `,
        data: {
          follow: true,
        },
      });
    },
  });

  return mutation;
};

export const useUnfollow = ({ followeeId }: { followeeId: string }) => {
  const mutation = useUnfollowMutation({
    update: (cache) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: "User",
          id: followeeId,
        }),
        fragment: gql`
          fragment UserUnFollow on User {
            follow
          }
        `,
        data: {
          follow: false,
        },
      });
    },
  });

  return mutation;
};

export const useBlock = () => {
  const mutation = useBlockMutation({
    update: (cache, result) => {
      const queryData = cache.readQuery<BlockingUsersQueryResult["data"]>({
        query: BlockingUsersDocument,
      });

      if (queryData) {
        cache.writeQuery({
          query: BlockingUsersDocument,
          data: {
            blockingUsers: [result.data.block, ...queryData.blockingUsers],
          },
        });
      }
    },
  });

  return mutation;
};

export const useUnblock = () => {
  const mutation = useUnBlockMutation({
    update: (cache, result) => {
      const queryData = cache.readQuery<BlockingUsersQueryResult["data"]>({
        query: BlockingUsersDocument,
      });

      if (queryData) {
        const newBlockingData = queryData.blockingUsers.filter(
          (b) => b.id !== result.data.unblock.id
        );

        cache.writeQuery({
          query: BlockingUsersDocument,
          data: { blockingUsers: newBlockingData },
        });
      }
    },
  });

  return mutation;
};

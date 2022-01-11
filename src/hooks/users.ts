import { gql, useApolloClient } from "@apollo/client";
import { useCallback } from "react";
import { UserPartsFragmentDoc, UserPartsFragment } from "src/generated/graphql";

export const useUserCacheFragment = () => {
  const { cache } = useApolloClient();
  const readUserFragment = useCallback(({ id }: { id: string }) => {
    const data = cache.readFragment<UserPartsFragment>({
      id: cache.identify({
        __typename: "User",
        id,
      }),
      fragment: UserPartsFragmentDoc,
    });

    return data;
  }, []);

  return {
    readUserFragment,
  };
};

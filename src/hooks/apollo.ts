import { gql, useApolloClient } from "@apollo/client";
import { useCallback } from "react";
import { Thought } from "src/generated/graphql";

export const useThoughtCacheFragment = () => {
  const { cache } = useApolloClient();
  const readThoughtFragment = useCallback((id: string) => {
    const data = cache.readFragment<Thought>({
      id: `Thought:${id}`,
      fragment: gql`
        fragment ThoughtFields on Thought {
          id
          title
          text
          contributor {
            id
            name
            imageUrl
          }
          picked
        }
      `,
    });

    return data;
  }, []);

  return {
    readThoughtFragment,
  };
};

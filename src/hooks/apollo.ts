import { gql, useApolloClient } from "@apollo/client";
import { useCallback } from "react";
import {
  Thought,
  useCreatePickMutation,
  useDeletePickMutation,
} from "src/generated/graphql";

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

export const useCreatePick = () => {
  const mutation = useCreatePickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: "Thought",
          id: data.createPick.thoughtId,
        }),
        fragment: gql`
          fragment CreatePickFields on Thought {
            picked
          }
        `,
        data: {
          picked: true,
        },
      });
    },
  });

  return mutation;
};

export const useDeletePick = () => {
  const mutation = useDeletePickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: "Thought",
          id: data.deletePick.thoughtId,
        }),
        fragment: gql`
          fragment DeletePickFields on Thought {
            picked
          }
        `,
        data: {
          picked: false,
        },
      });
    },
  });

  return mutation;
};

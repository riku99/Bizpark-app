import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  Thought,
  useCreatePickMutation,
  useDeletePickMutation,
  NewsFieldsFragmentDoc,
  News,
  useCreateNewsPickMutation,
  useDeleteNewsPickMutation,
} from 'src/generated/graphql';

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
          images {
            id
            url
            width
            height
          }
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

export const useNewsCacheFragment = () => {
  const { cache } = useApolloClient();
  const readNewsFragment = useCallback(({ id }: { id: number }) => {
    const data = cache.readFragment<News>({
      id: cache.identify({
        __typename: 'News',
        id,
      }),
      fragment: NewsFieldsFragmentDoc,
    });

    return data;
  }, []);

  return {
    readNewsFragment,
  };
};

export const useCreatePick = () => {
  const mutation = useCreatePickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: 'Thought',
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
          __typename: 'Thought',
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

export const useCreateNewsPick = () => {
  const mutation = useCreateNewsPickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: 'News',
          id: data.createNewsPick.newsId,
        }),
        fragment: gql`
          fragment CreateNewsPickFields on News {
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

export const useDeleteNewsPick = () => {
  const mutation = useDeleteNewsPickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({
          __typename: 'News',
          id: data.deleteNewsPick.newsId,
        }),
        fragment: gql`
          fragment DeleteNewsPickFields on News {
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

import { useNewsQuery, NewsGenre } from 'src/generated/graphql';
import { btoa } from 'react-native-quick-base64';

export const useNews = ({ genre }: { genre: NewsGenre }) => {
  const { data, refetch, fetchMore } = useNewsQuery({
    variables: {
      genre,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.news;

    if (pageInfo.hasNextPage) {
      const { endCursor } = pageInfo;

      await fetchMore({
        variables: {
          genre,
          cursor: endCursor ? btoa(endCursor) : undefined,
        },
      });
    }
  };

  return {
    data,
    refresh,
    infiniteLoad,
  };
};

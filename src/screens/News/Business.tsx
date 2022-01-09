import React from "react";
import { Box } from "native-base";
import { useNewsQuery, NewsGenre } from "src/generated/graphql";
import { NewsCard } from "src/components/NewsCard";
import { List } from "./List";
import { btoa } from "react-native-quick-base64";

export const Business = React.memo(() => {
  const { data, refetch, fetchMore } = useNewsQuery({
    variables: {
      genre: NewsGenre.Business,
    },
  });

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.news;
    const { endCursor } = pageInfo;

    await fetchMore({
      variables: {
        genre: NewsGenre.Business,
        cursor: endCursor ? btoa(endCursor) : undefined,
      },
    });
  };

  if (!data) {
    return null;
  }

  return (
    <Box flex={1}>
      <List data={data} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});

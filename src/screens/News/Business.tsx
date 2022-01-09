import React from "react";
import { Box } from "native-base";
import { useNewsQuery, NewsGenre } from "src/generated/graphql";
import { NewsCard } from "src/components/NewsCard";
import { List } from "./List";

export const Business = React.memo(() => {
  const { data, refetch } = useNewsQuery({
    variables: {
      genre: NewsGenre.Business,
    },
  });

  const refresh = async () => {
    await refetch();
  };

  if (!data) {
    return null;
  }

  return (
    <Box flex={1}>
      <List data={data} refresh={refresh} />
    </Box>
  );
});

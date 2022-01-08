import React from "react";
import { Box } from "native-base";
import { useNewsQuery, NewsGenre } from "src/generated/graphql";
import { NewsCard } from "src/components/NewsCard";

export const Business = React.memo(() => {
  const { data } = useNewsQuery({
    variables: {
      genre: NewsGenre.Business,
    },
  });

  if (data) {
    console.log(data.news.edges[0].node);
    return <NewsCard id={data.news.edges[1].node.id} />;
  }

  return <Box flex={1}></Box>;
});

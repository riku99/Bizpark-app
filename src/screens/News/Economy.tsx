import React from "react";
import { Box } from "native-base";
import { useNews } from "src/hooks/news";
import { NewsGenre } from "src/generated/graphql";
import { List } from "./List";
import { Indicator } from "src/components/Indicator";

export const Economy = React.memo(() => {
  const { data, infiniteLoad, refresh } = useNews({
    genre: NewsGenre.Economy,
  });

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <List data={data} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});

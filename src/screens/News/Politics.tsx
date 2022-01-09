import React from "react";
import { Box } from "native-base";
import { NewsGenre } from "src/generated/graphql";
import { List } from "./List";
import { Indicator } from "src/components/Indicator";
import { useNews } from "src/hooks/news";

export const Politics = React.memo(() => {
  const { data, infiniteLoad, refresh } = useNews({
    genre: NewsGenre.Politics,
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

import React from "react";
import { Box } from "native-base";
import { useNewsQuery, NewsGenre } from "src/generated/graphql";
import { List } from "./List";
import { btoa } from "react-native-quick-base64";
import { Indicator } from "src/components/Indicator";

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
    if (pageInfo.hasNextPage) {
      const { endCursor } = pageInfo;

      const { data: d } = await fetchMore({
        variables: {
          genre: NewsGenre.Business,
          cursor: endCursor ? btoa(endCursor) : undefined,
        },
      });

      console.log(d.news.edges[0].node);
    }
  };

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <List data={data} refresh={refresh} infiniteLoad={infiniteLoad} />
    </Box>
  );
});

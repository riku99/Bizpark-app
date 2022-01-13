import React from "react";
import { Box } from "native-base";
import { usePickedNewsQuery } from "src/generated/graphql";
import { btoa } from "react-native-quick-base64";
import { List } from "src/components/NewsList";
import { Indicator } from "src/components/Indicator";

export const PickedNews = () => {
  const { data, refetch, fetchMore } = usePickedNewsQuery();

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.pickedNews;
    if (pageInfo.hasNextPage) {
      const { endCursor } = pageInfo;

      await fetchMore({
        variables: {
          cursor: endCursor ? btoa(endCursor) : undefined,
        },
      });
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
};

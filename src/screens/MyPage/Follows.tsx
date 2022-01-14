import React from "react";
import { Box } from "native-base";
import { useFollowsQuery } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";

export const Follows = React.memo(() => {
  const { data } = useFollowsQuery();

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  console.log(data.follows.edges);
  return <Box></Box>;
});

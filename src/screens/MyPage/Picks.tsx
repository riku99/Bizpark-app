import React from "react";
import { Box } from "native-base";
import { usePickedThoughtsQuery } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";

export const Picks = React.memo(() => {
  const { data } = usePickedThoughtsQuery();

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  console.log(data.pickedThoughts.edges);
  return <Box></Box>;
});

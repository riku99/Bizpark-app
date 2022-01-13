import React from "react";
import { Box } from "native-base";
import { useUserThoughtsQuery } from "src/generated/graphql";
import { List } from "src/components/ThoughtList";
import { Indicator } from "src/components/Indicator";
import { meVar } from "src/stores/me";

export const Thouhgts = React.memo(() => {
  const myId = meVar.id();
  const { data } = useUserThoughtsQuery({
    variables: {
      userId: myId,
    },
  });

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  console.log(data.userThoughts.edges);

  return <Box flex={1}></Box>;
});

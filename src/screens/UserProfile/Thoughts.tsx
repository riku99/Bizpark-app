import React from "react";
import { useUserThoughtsQuery } from "src/generated/graphql";
import { btoa } from "react-native-quick-base64";
import { Indicator } from "src/components/Indicator";
import { Box } from "native-base";
import { List } from "src/components/ThoughtList";

type Props = {
  id: string;
};

export const Thoughts = React.memo(({ id }: Props) => {
  const { data, refetch, fetchMore } = useUserThoughtsQuery({
    variables: {
      userId: id,
    },
  });

  const refresh = async () => {
    await refetch();
  };

  const infiniteLoad = async () => {
    const { pageInfo } = data.userThoughts;
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
    <Box flex={1} px="4" pt="4">
      <List
        data={data.userThoughts.edges}
        refresh={refresh}
        infiniteLoad={infiniteLoad}
      />
    </Box>
  );
});

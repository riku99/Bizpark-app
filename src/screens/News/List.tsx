import React, { useCallback } from "react";
import { Box, Text, FlatList } from "native-base";
import { NewsQuery } from "src/generated/graphql";

type Props = {
  data: NewsQuery;
};

export const List = React.memo(({ data }: Props) => {
  const renderItem = useCallback(() => {}, []);
});

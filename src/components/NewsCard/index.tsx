import React from "react";
import { Box, Pressable, Text } from "native-base";
import { useNewsCacheFragment } from "src/hooks/apollo";
import { format } from "date-fns";

type Props = {
  id: string;
};

export const NewsCard = React.memo(({ id }: Props) => {
  const { readNewsFragment } = useNewsCacheFragment();
  const cahceData = readNewsFragment({ id });

  if (!cahceData) {
    return null;
  }
  const { title, provider, articleCreatedAt } = cahceData;
  const formatedDate = format(
    new Date(Number(articleCreatedAt)),
    "yyyy/MM/dd HH:mm"
  );

  return (
    <Pressable w="100%" px="4" py="4">
      <Box w="70%">
        <Text fontWeight="bold" fontSize="16">
          {title}
        </Text>
        <Text mt="2">{provider ?? ""}</Text>
        <Text mt="2" fontSize="12">
          {formatedDate}
        </Text>
      </Box>
    </Pressable>
  );
});

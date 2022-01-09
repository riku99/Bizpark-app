import React from "react";
import { Box, Pressable, Text } from "native-base";
import { useNewsCacheFragment } from "src/hooks/apollo";
import { format } from "date-fns";
import { Image } from "src/components/Image";

type Props = {
  id: string;
};

export const NewsCard = React.memo(({ id }: Props) => {
  const { readNewsFragment } = useNewsCacheFragment();
  const cahceData = readNewsFragment({ id });

  if (!cahceData) {
    return null;
  }
  const { title, provider, articleCreatedAt, image } = cahceData;
  const formatedDate = format(
    new Date(Number(articleCreatedAt)),
    "yyyy/MM/dd HH:mm"
  );

  return (
    <Pressable
      w="100%"
      px="4"
      py="4"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box w="70%">
        <Text fontWeight="bold" fontSize="14">
          {title}
        </Text>
        <Text mt="2">
          {provider ?? ""}{" "}
          <Text mt="1" fontSize="10">
            {formatedDate}
          </Text>
        </Text>
      </Box>

      {!!image && (
        <Image
          source={{
            uri: image,
          }}
          size="16"
        />
      )}
    </Pressable>
  );
});

import React, { ComponentProps } from "react";
import { Box, Pressable, Text } from "native-base";
import { useNewsCacheFragment } from "src/hooks/apollo";
import { format } from "date-fns";
import { Image } from "src/components/Image";
import { Pick } from "src/components/Pick";

type Props = {
  id: string;
} & ComponentProps<typeof Pressable>;

export const NewsCard = React.memo(({ id, ...props }: Props) => {
  const { readNewsFragment } = useNewsCacheFragment();
  const cahceData = readNewsFragment({ id });

  if (!cahceData) {
    return null;
  }
  const { title, provider, articleCreatedAt, image, picked } = cahceData;
  const formatedDate = format(
    new Date(Number(articleCreatedAt)),
    "yyyy/MM/dd HH:mm"
  );

  return (
    <Pressable w="100%" px="4" py="4" {...props}>
      <Box w="100%" flexDirection="row" justifyContent="space-between">
        <Box w="70%">
          <Text fontWeight="bold" fontSize="14">
            {title}
          </Text>
        </Box>

        {!!image && (
          <Image
            source={{
              uri: image,
            }}
            w="16"
            h="10"
          />
        )}
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        mt="4"
        justifyContent="space-between"
      >
        <Text maxW="70%">
          {provider ?? ""}{" "}
          <Text mt="1" fontSize="10">
            {formatedDate}
          </Text>
        </Text>

        <Pick
          mr="2"
          checkBoxProp={{
            checked: picked,
            onPress: () => {},
            style: {
              height: 24,
              width: 24,
              marginLeft: 6,
            },
          }}
        />
      </Box>
    </Pressable>
  );
});

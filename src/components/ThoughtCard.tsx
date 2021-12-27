import React, { ComponentProps, useState } from "react";
import { Box, useColorModeValue, Text, Flex } from "native-base";
import { Image } from "react-native-expo-image-cache";
import { CheckBox } from "./CheckBox";

type Props = {
  title: string | null;
  text: string;
  picked: boolean;
  contributor: {
    name: string;
    imageUrl: null | string;
  };
} & ComponentProps<typeof Box>;

export const ThoughtCard = ({
  title,
  text,
  contributor,
  picked,
  ...props
}: Props) => {
  const [checked, setChecked] = useState(picked);

  const onCheckPress = () => {
    setChecked((c) => !c);
  };

  return (
    <Box
      bg={useColorModeValue("white", "warmGray.800")}
      borderRadius="lg"
      py={14}
      px={4}
      shadow={3}
      {...props}
    >
      <Flex direction="row" alignItems="center">
        <Image
          uri={contributor.imageUrl}
          style={{ height: 34, width: 34, borderRadius: 34 }}
        />
        <Text fontWeight="bold" ml={2}>
          {contributor.name}
        </Text>
      </Flex>
      {title && (
        <Text fontSize={16} fontWeight="bold" mt={2}>
          {title}
        </Text>
      )}
      <Text maxH={20} mt={!title ? 2 : 1}>
        {text}
      </Text>
      <Flex mt={2} direction="row" alignItems="center">
        <Text color="pink" fontWeight="bold" fontSize={16}>
          Pick
        </Text>
        <CheckBox
          onPress={onCheckPress}
          checked={checked}
          style={{ height: 30, width: 30, marginLeft: 6 }}
        />
      </Flex>
    </Box>
  );
};

import React, { useState } from "react";
import { Box, useColorMode, Text, Flex } from "native-base";
import { Image } from "react-native-expo-image-cache";
import AnimatedCheckbox from "react-native-checkbox-reanimated";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  title: string | null;
  text: string;
  picked: boolean;
  contributor: {
    name: string;
    imageUrl: null | string;
  };
};

export const ThoughtCard = ({ title, text, contributor, picked }: Props) => {
  const [checked, setChecked] = useState(picked);

  const onCheckPress = () => {
    Haptics.selectionAsync();
    setChecked((c) => !c);
  };

  return (
    <Box bg="warmGray.800" borderRadius="lg" py={14} px={4}>
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
      <Text h={20}>{text}</Text>
      <Flex mt={2} direction="row" alignItems="center">
        <Text color="pink" fontWeight="bold" fontSize={16}>
          Pick
        </Text>
        <Pressable
          onPress={onCheckPress}
          style={{ width: 30, height: 30, marginLeft: 4 }}
        >
          <AnimatedCheckbox
            checked={checked}
            highlightColor="#4444ff"
            checkmarkColor="#ffffff"
            boxOutlineColor="#4444ff"
          />
        </Pressable>
      </Flex>
    </Box>
  );
};

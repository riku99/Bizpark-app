import React from "react";
import { HStack, Text, Pressable, useColorModeValue } from "native-base";
import { RightIcon } from "src/components/RightIcon";

type Props = {
  Icon?: JSX.Element;
  title: string;
  onPress: () => void;
};

export const SimpleListItem = ({ Icon, title, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      _pressed={{
        bg: useColorModeValue("lt.pressed", "dt.pressed"),
      }}
    >
      <HStack justifyContent="space-between" alignItems="center" py="4">
        <HStack alignItems="center">
          {!!Icon && Icon}
          <Text fontWeight="bold" fontSize="16" ml={Icon ? "3" : 0}>
            {title}
          </Text>
        </HStack>

        <RightIcon />
      </HStack>
    </Pressable>
  );
};

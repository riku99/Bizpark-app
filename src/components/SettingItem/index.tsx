import React from "react";
import { HStack, Text, Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { RightIcon } from "src/components/RightIcon";

type Props = {
  Icon: JSX.Element;
  title: string;
  onPress: () => void;
};

export const SettingItem = ({ Icon, title, onPress }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <HStack justifyContent="space-between" alignItems="center">
        <HStack alignItems="center">
          {Icon}
          <Text fontWeight="bold" fontSize="16" ml="3">
            {title}
          </Text>
        </HStack>

        <RightIcon />
      </HStack>
    </Pressable>
  );
};

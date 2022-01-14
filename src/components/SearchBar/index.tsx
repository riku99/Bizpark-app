import React, { ComponentProps } from "react";
import { Input, useColorModeValue, Icon } from "native-base";
import { LogBox } from "react-native";
import { Ionicons } from "@expo/vector-icons";

LogBox.ignoreLogs(["NativeBase"]);

type Props = ComponentProps<typeof Input>;

export const SerachBar = ({ ...props }: Props) => {
  return (
    <Input
      h="9"
      bg={useColorModeValue("trueGray.200", "trueGray.700")}
      fontSize="16"
      placeholder="検索"
      InputLeftElement={
        <Icon
          as={<Ionicons name="md-search-sharp" />}
          size="5"
          ml="2"
          color="muted.400"
        />
      }
      {...props}
    />
  );
};

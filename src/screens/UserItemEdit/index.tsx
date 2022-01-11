import React, { useLayoutEffect, useState } from "react";
import { Box, Input, Text, useColorModeValue, Pressable } from "native-base";
import { RootNavigationScreenProp } from "src/types";

type Props = RootNavigationScreenProp<"UserItemEdit">;

export const UserItemEditScreen = ({ navigation, route }: Props) => {
  const { type, value, setValue } = route.params;
  let title = "";
  switch (type) {
    case "name":
      title = "名前";
      break;
    case "bio":
      title = "自己紹介";
      break;
    case "facebook":
      title = "Facebook";
      break;
    case "instagram":
      title = "Instagram";
      break;
    case "linkedin":
      title = "LinkedIn";
      break;
    case "twitter":
      title = "Twitter";
      break;
  }

  const [newValue, setNewValue] = useState(value);

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => (
        <Pressable
          onPress={() => {
            setValue(newValue);
            navigation.goBack();
          }}
        >
          <Text fontWeight="bold" color="pink" fontSize="17">
            保存
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, setValue, newValue]);

  return (
    <Box flex={1}>
      <Box h="48" pt="4" px="2">
        <Input
          borderWidth="0"
          borderBottomWidth="1"
          mt="2"
          fontSize="16"
          _focus={{
            borderBottomColor: "lightGray",
          }}
          multiline={type === "bio"}
          autoFocus
          keyboardAppearance={useColorModeValue("light", "dark")}
          onChangeText={setNewValue}
          defaultValue={value}
        />
      </Box>
    </Box>
  );
};

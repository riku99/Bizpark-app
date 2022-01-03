import React, { useLayoutEffect } from "react";
import { Box, Pressable, Text, Input, useColorModeValue } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";
import { InputAccessoryView } from "react-native";

type Props = RootNavigationScreenProp<"ThoughtWriting">;

const Share = () => {
  return (
    <Pressable>
      <Text fontWeight="bold" color="pink" fontSize={16}>
        シェア
      </Text>
    </Pressable>
  );
};

export const ThoughtWritingScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      headerRight: () => <Share />,
      title: "作成",
    });
  }, []);

  const textInputId = "textInput";

  return (
    <Box flex={1} px={4}>
      <Input
        borderWidth={0}
        fontSize={17}
        fontWeight="bold"
        placeholder="タイトル (任意)"
        mt={2}
        keyboardAppearance={useColorModeValue("light", "dark")}
      />

      <Box h="100%">
        <Input
          borderWidth={0}
          mt={4}
          placeholder="テキスト"
          fontSize={16}
          multiline
          h="28%"
          keyboardAppearance={useColorModeValue("light", "dark")}
          autoFocus
          inputAccessoryViewID={textInputId}
        />
      </Box>

      <InputAccessoryView nativeID={textInputId}>
        <Box w={40} h={50} bg="blue.900"></Box>
      </InputAccessoryView>
    </Box>
  );
};

import React, { useLayoutEffect } from "react";
import { Box, Pressable, Text, Input, useColorModeValue } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { CloseButton } from "src/components/BackButon";

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

  return (
    <Box flex={1} px={4}>
      {/* <Text fontSize={18} fontWeight="bold">
        タイトル (任意)
      </Text> */}
      <Input
        borderWidth={0}
        fontSize={17}
        fontWeight="bold"
        placeholder="タイトル (任意)"
        mt={2}
      />

      <Input
        borderWidth={0}
        mt={6}
        placeholder="テキスト"
        fontSize={16}
        multiline
        h="28%"
        keyboardAppearance={useColorModeValue("light", "dark")}
      />
    </Box>
  );
};

import React, { useLayoutEffect } from "react";
import { RootNavigationProp } from "types";
import { Mail, Apple, Google } from "src/components/AuthButton";
import { VStack, Box } from "native-base";

type Props = RootNavigationProp<"Signin">;

export const SigninScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "ログイン",
    });
  }, [navigation]);

  return (
    <Box flex={1} bg="white">
      <VStack space={4} px={8} mt="5/6">
        <Mail type="signin" />
        <Apple type="signin" />
        <Google type="signin" />
      </VStack>
    </Box>
  );
};

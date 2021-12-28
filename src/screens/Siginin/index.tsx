import React, { useLayoutEffect } from "react";
import {} from "react-native";
import { Bg } from "src/components/Bg";
import { RootNavigationProp } from "types";
import { Mail, Apple, Google } from "src/components/AuthButton";
import { VStack } from "native-base";

type Props = RootNavigationProp<"Signin">;

export const SigninScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "ログイン",
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <Bg flex={1}>
      <VStack space={4} px={8} mt="5/6">
        <Mail type="signin" />
        <Apple type="signin" />
        <Google type="signin" />
      </VStack>
    </Bg>
  );
};

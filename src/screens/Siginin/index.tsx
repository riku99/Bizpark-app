import React, { useLayoutEffect } from "react";
import { RootNavigationProp } from "types";
import { Mail, Apple, Google } from "src/components/AuthButton";
import { VStack, Box, useTheme } from "native-base";

type Props = RootNavigationProp<"Signin">;

export const SigninScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "ログイン",
      headerStyle: {
        backgroundColor: "white",
      },
      headerTitleStyle: {
        color: colors.textBlack,
      },
      headerTintColor: colors.textBlack,
      headerBackTitleVisible: false,
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

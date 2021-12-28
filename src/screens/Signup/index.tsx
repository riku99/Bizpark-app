import React, { useLayoutEffect } from "react";
import { Box, VStack } from "native-base";
import { RootNavigationProp } from "types";
import { SafeAreaView } from "react-native";
import { Bg } from "src/components/Bg";
import { SwipeContent } from "./SwipeContent";
import { Mail, Apple, Google } from "src/components/AuthButton";

type Props = RootNavigationProp<"Signup">;

export const SignupScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Bg flex={1}>
      <SafeAreaView>
        <Box h={320} alignItems="center" mt={20}>
          <SwipeContent />
        </Box>
        <VStack space={4} px={8}>
          <Mail />
          <Apple />
          <Google />
        </VStack>
      </SafeAreaView>
    </Bg>
  );
};

import React, { useLayoutEffect } from "react";
import { Box, VStack, Text, Pressable } from "native-base";
import { RootNavigationProp } from "types";
import { SafeAreaView } from "react-native";
import { Bg } from "src/components/Bg";
import { SwipeContent } from "./SwipeContent";
import { Mail, Apple, Google } from "src/components/AuthButton";
import { HIGHER_8_DEVICE } from "src/constants";

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
        <Box h={HIGHER_8_DEVICE ? 310 : 280} alignItems="center" mt={20}>
          <SwipeContent />
        </Box>
        <VStack space={4} px={8}>
          <Mail />
          <Apple />
          <Google />
        </VStack>
        <Box flexDirection="row" justifyContent="center" mt={8}>
          <Text>既に登録済みの方</Text>
          <Pressable>
            <Text ml={8} textDecorationLine="underline">
              ログイン
            </Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    </Bg>
  );
};

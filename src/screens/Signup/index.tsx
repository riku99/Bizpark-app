import React, { useLayoutEffect, useEffect } from "react";
import { Box, VStack, Text, Pressable } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { SafeAreaView } from "react-native";
import { Bg } from "src/components/Bg";
import { SwipeContent } from "./SwipeContent";
import { Mail, Apple, Google } from "src/components/AuthButton";
import { HIGHER_8_DEVICE } from "src/constants";
import { useSignupWithApple, useSignupWithGoogle } from "src/hooks/auth";

type Props = RootNavigationScreenProp<"Signup">;

export const SignupScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { signupWithApple } = useSignupWithApple();
  const { signupWithGoogle } = useSignupWithGoogle();

  const onMailPress = () => {
    navigation.navigate("MailForm", {
      type: "signUp",
    });
  };

  const onApplePress = async () => {
    await signupWithApple();
  };

  const onGooglePress = async () => {
    await signupWithGoogle();
  };

  return (
    <Bg flex={1} bg="white">
      <SafeAreaView>
        <Box h={HIGHER_8_DEVICE ? 310 : 280} alignItems="center" mt={20}>
          <SwipeContent />
        </Box>
        <VStack space={4} px={8}>
          <Mail onPress={onMailPress} />
          <Apple onPress={onApplePress} />
          <Google onPress={onGooglePress} />
        </VStack>
        <Box flexDirection="row" justifyContent="center" mt={8}>
          <Text color="textBlack">既に登録済みの方</Text>
          <Pressable
            onPress={() => {
              navigation.navigate("Signin");
            }}
          >
            <Text ml={8} textDecorationLine="underline" color="textBlack">
              ログイン
            </Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    </Bg>
  );
};

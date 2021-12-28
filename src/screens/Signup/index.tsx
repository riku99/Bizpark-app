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

  const onMailPress = () => {
    navigation.navigate("MailForm");
  };

  return (
    <Bg flex={1} bg="white">
      <SafeAreaView>
        <Box h={HIGHER_8_DEVICE ? 310 : 280} alignItems="center" mt={20}>
          <SwipeContent />
        </Box>
        <VStack space={4} px={8}>
          <Mail onPress={onMailPress} />
          <Apple />
          <Google />
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

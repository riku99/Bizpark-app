import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationProp } from "types";
import { SafeAreaView } from "react-native";
import { Bg } from "src/components/Bg";
import { SwipeContent } from "./SwipeContent";

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
      </SafeAreaView>
    </Bg>
  );
};

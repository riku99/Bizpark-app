import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationProp } from "types";
import Browsing from "src/assets/svg/browsing.svg";
import { SafeAreaView } from "react-native";
import { Bg } from "src/components/Bg";

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
        <Box alignItems="center">
          <Browsing width={180} height={180} />
        </Box>
      </SafeAreaView>
    </Bg>
  );
};

import React, { useLayoutEffect } from "react";
import {} from "react-native";
import { Bg } from "src/components/Bg";
import { RootNavigationProp } from "types";

type Props = RootNavigationProp<"Signin">;

export const SigninScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "サインイン",
      headerShadowVisible: false,
    });
  }, [navigation]);

  return <Bg flex={1}></Bg>;
};

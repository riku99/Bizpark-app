import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

type RootStackParamList = {
  Tab: undefined;
  Signup: undefined;
  Signin: undefined;
};

export type RootNavigationProp<
  T extends keyof RootStackParamList
> = NativeStackScreenProps<RootStackParamList, T>;

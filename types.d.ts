import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  Tab: undefined;
  Signup: undefined;
  Signin: undefined;
  MailForm: {
    type: "signUp" | "signIn";
  };
  Thought: {
    id: string;
    title: string | null;
    text: string;
    contributor: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  };
};

export type RootNavigationScreenProp<
  T extends keyof RootStackParamList
> = NativeStackScreenProps<RootStackParamList, T>;

export type RootNavigationProp<
  T extends keyof RootStackParamList
> = NativeStackNavigationProp<RootStackParamList, T>;

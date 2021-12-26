import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Tab: undefined;
};

export type RootNavigationProp<
  T extends keyof RootStackParamList
> = NativeStackScreenProps<RootStackParamList, T>;

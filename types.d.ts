import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Tab: undefined;
};

type StackScreenProps<
  T extends keyof RootStackParamList
> = NativeStackNavigationProp<RootStackParamList, T>;

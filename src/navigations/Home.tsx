import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "src/screens/Home";
import { UserProfileScreen } from "src/screens/UserProfile";
import { useColorModeValue, useTheme } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type HomeStackParamList = {
  Home: undefined;
  UserProfile: {
    id: string;
  };
};

export type HomeNavigationScreenProps<
  T extends keyof HomeStackParamList
> = NativeStackScreenProps<HomeStackParamList, T>;

const Stack = createNativeStackNavigator();

export const HomeStack = React.memo(() => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
        headerTitleStyle: {
          color: useColorModeValue(colors.textBlack, "white"),
        },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
});

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BottomTab } from "./Tab";
import { StatusBar } from "expo-status-bar";
import { useColorModeValue, useTheme } from "native-base";
import { SignupScreen } from "src/screens/Signup";
import { SigninScreen } from "src/screens/Siginin";
import { RootStackParamList } from "types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const { colors } = useTheme();

  return (
    <>
      {/* AppだとうまくcolorModeが動かなかったのでここで定義 */}
      <StatusBar style={useColorModeValue("dark", "light")} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
          },
          headerTitleStyle: {
            color: useColorModeValue(colors.textBlack, "white"),
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="Tab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Signin" component={SigninScreen} />
      </Stack.Navigator>
    </>
  );
});

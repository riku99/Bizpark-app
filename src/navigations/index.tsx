import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BottomTab } from "./Tab";
import { StatusBar } from "expo-status-bar";
import { useColorModeValue } from "native-base";
import { SignupScreen } from "src/screens/Signup";

const Stack = createNativeStackNavigator();

export const RootNavigation = React.memo(() => {
  return (
    <>
      {/* AppだとうまくcolorModeが動かなかったのでここで定義 */}
      <StatusBar style={useColorModeValue("dark", "light")} />
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="Tab"
          component={BottomTab}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: "red",
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
});

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { BottomTab } from "./Tab";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "types";
import { useColorModeValue, useTheme } from "native-base";
import { SignupScreen } from "src/screens/Signup";
import { SigninScreen } from "src/screens/Siginin";
import { MailFormScreen } from "src/screens/MailForm";
import { meVar, storageKeys } from "src/globals/me";
import { useReactiveVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const { colors } = useTheme();

  const myId = useReactiveVar(meVar.id);
  console.log("🌙 My id is " + myId);

  useEffect(() => {
    (async function () {
      const d = await AsyncStorage.getItem(storageKeys.id);
      console.log("👀 storage key is " + d);
    })();
  }, []);

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
        <Stack.Screen
          name="Tab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Group
          screenOptions={{
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              color: colors.textBlack,
            },
            headerTintColor: colors.textBlack,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="MailForm" component={MailFormScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
});

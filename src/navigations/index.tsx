import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BottomTab } from "./Tab";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "src/types";
import { useColorModeValue, useTheme } from "native-base";
import { SignupScreen } from "src/screens/Signup";
import { SigninScreen } from "src/screens/Siginin";
import { MailFormScreen } from "src/screens/MailForm";
import { meVar } from "src/stores/me";
import { useReactiveVar } from "@apollo/client";
import { ThoughtScreen } from "src/screens/Thought";
import { ThoughtWritingScreen } from "src/screens/ThoughtWriting";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const loggedIn = useReactiveVar(meVar.loggedIn);
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
          headerShadowVisible: false,
        }}
      >
        {!loggedIn && (
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
        )}
        {loggedIn && (
          <>
            <Stack.Screen
              name="Tab"
              component={BottomTab}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Thought" component={ThoughtScreen} />
            <Stack.Group
              screenOptions={{
                presentation: "modal",
              }}
            >
              <Stack.Screen
                name="ThoughtWriting"
                component={ThoughtWritingScreen}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </>
  );
});

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
import { ThoughtShareScreen } from "src/screens/ThoughtShare";
import { NewsWebViewScreen } from "src/screens/NewsWebView";
import { UserEditScreen } from "src/screens/UserEdit";
import { UserItemEditScreen } from "src/screens/UserItemEdit";
import { UserProfileScreen } from "src/screens/UserProfile";
import { Settings } from "./Settings";
import { TalkRoomScreen } from "src/screens/TalkRoom";

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
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Thought" component={ThoughtScreen} />
            <Stack.Screen name="NewsWebView" component={NewsWebViewScreen} />
            <Stack.Screen name="UserEdit" component={UserEditScreen} />
            <Stack.Screen name="UserItemEdit" component={UserItemEditScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="TalkRoom" component={TalkRoomScreen} />
            <Stack.Group
              screenOptions={{
                presentation: "modal",
              }}
            >
              <Stack.Screen
                name="ThoughtWriting"
                component={ThoughtWritingScreen}
              />
              <Stack.Screen
                name="ThoughtShare"
                component={ThoughtShareScreen}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </>
  );
});

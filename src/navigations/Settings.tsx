import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsScreen } from "src/screens/Settings";
import { useNavigationHeaderStyle } from "src/hooks/theme";
import { UserSettingsScreen } from "src/screens/UserSettings";
import { BlockingUsersScreen } from "src/screens/BlockingUsers";
import { AccountSettingsScreen } from "src/screens/AccountSettings";

export type SettingsParamList = {
  SettingList: undefined;
  UserSettings: undefined;
  BlockingUsers: undefined;
  AccountSettings: undefined;
};

const Stack = createNativeStackNavigator<SettingsParamList>();

export const Settings = React.memo(() => {
  const { headerStyle, headerTitleStyle } = useNavigationHeaderStyle();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle,
        headerTitleStyle,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="SettingList" component={SettingsScreen} />
      <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
      <Stack.Screen name="BlockingUsers" component={BlockingUsersScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
    </Stack.Navigator>
  );
});

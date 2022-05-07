import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useNavigationHeaderStyle } from 'src/hooks/theme';
import { AccountSettingsScreen } from 'src/screens/AccountSettings';
import { BlockingUsersScreen } from 'src/screens/BlockingUsers';
import { EmailChangeScreen } from 'src/screens/EmailChange';
import { SettingsScreen } from 'src/screens/Settings';
import { UserSettingsScreen } from 'src/screens/UserSettings';

export type SettingsParamList = {
  SettingList: undefined;
  UserSettings: undefined;
  BlockingUsers: undefined;
  AccountSettings: undefined;
  EmailChange: undefined;
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
      <Stack.Screen name="EmailChange" component={EmailChangeScreen} />
    </Stack.Navigator>
  );
});

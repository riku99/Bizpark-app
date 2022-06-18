import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useNavigationHeaderStyle } from 'src/hooks/theme';
import { AccountSettingsScreen } from 'src/screens/AccountSettings';
import { BlockingUsersScreen } from 'src/screens/BlockingUsers';
import { EmailChangeScreen } from 'src/screens/EmailChange';
import { EmailChangeVerificationScreen } from 'src/screens/EmailChangeVerification';
import { IAPScreen } from 'src/screens/IAP';
import { MessageSettingsScreen } from 'src/screens/MessageSettings';
import { PushNotificationSettingsScreen } from 'src/screens/PushNotificationSettings';
import { SettingsScreen } from 'src/screens/Settings';
import { TermsOfUseScreen } from 'src/screens/TermsOfUse';
import { UserSettingsScreen } from 'src/screens/UserSettings';

export type SettingsParamList = {
  SettingList: undefined;
  UserSettings: undefined;
  BlockingUsers: undefined;
  AccountSettings: undefined;
  EmailChange: undefined;
  EmaiChangeVerification: {
    emailAuthCodeId: number;
    email: string;
    kind: 'EmailChange';
  };
  MessageSettings: undefined;
  PushNotificationSettings: undefined;
  TermsOfUse: undefined;
  IAP: undefined;
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
      <Stack.Screen
        name="EmaiChangeVerification"
        component={EmailChangeVerificationScreen}
      />
      <Stack.Screen name="MessageSettings" component={MessageSettingsScreen} />
      <Stack.Screen
        name="PushNotificationSettings"
        component={PushNotificationSettingsScreen}
      />
      <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
      <Stack.Screen name="IAP" component={IAPScreen} />
    </Stack.Navigator>
  );
});

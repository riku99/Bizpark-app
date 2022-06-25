import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useColorModeValue } from 'native-base';
import React from 'react';
import { useLoggedIn } from 'src/hooks/me';
import { PrivacyPolicyScreen } from 'src/screens/PrivacyPolicy';
import { TermsOfUseScreen } from 'src/screens/TermsOfUse';
import { AuthStack } from './Auth';
import { MainStack } from './Main';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const { loggedIn } = useLoggedIn();

  const statusBarColor = useColorModeValue('dark', 'light');

  return (
    <>
      <StatusBar style={statusBarColor} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
    </>
  );
});

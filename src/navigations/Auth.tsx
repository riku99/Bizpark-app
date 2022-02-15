import React from 'react';
import { useTheme } from 'native-base';
import { SignupScreen } from 'src/screens/Signup';
import { SigninScreen } from 'src/screens/Siginin';
import { MailFormScreen } from 'src/screens/MailForm';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AuthSrackParamList = {
  Signup: undefined;
  Signin: undefined;
  MailForm: {
    type: 'signUp' | 'signIn';
  };
};

const Stack = createNativeStackNavigator<AuthSrackParamList>();

export const AuthStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
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
    </Stack.Navigator>
  );
};

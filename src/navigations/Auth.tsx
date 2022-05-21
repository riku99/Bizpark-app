import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'native-base';
import React from 'react';
import { EmailVerificationScreen } from 'src/screens/EmailVerification';
import { MailFormScreen } from 'src/screens/MailForm';
import { SigninScreen } from 'src/screens/Siginin';
import { SignupScreen } from 'src/screens/Signup';

export type AuthStackParamList = {
  Signup: undefined;
  Signin: undefined;
  MailForm: {
    type: 'signUp' | 'signIn';
  };
  EmailVerification: {
    name: string;
    email: string;
    password: string;
    emailAuthCodeId: number;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

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
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
    </Stack.Navigator>
  );
};

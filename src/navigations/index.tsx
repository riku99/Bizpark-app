import dynamicLinks from '@react-native-firebase/dynamic-links';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useColorModeValue } from 'native-base';
import React, { useEffect } from 'react';
import { useLoggedIn } from 'src/hooks/me';
import { AuthStack } from './Auth';
import { MainStack } from './Main';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const { loggedIn } = useLoggedIn();

  const statusBarColor = useColorModeValue('dark', 'light');

  useEffect(() => {
    const unsbscribe = dynamicLinks().onLink((link) => {
      console.log(link);

      if (link.url === 'https://bizpark.me/email-verified') {
        console.log('Hey, DL is correctly setup!');
        // メールアドレス認証完了後の処理
      }
    });

    return () => unsbscribe();
  }, []);

  return (
    <>
      <StatusBar style={statusBarColor} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
      </Stack.Navigator>
    </>
  );
});

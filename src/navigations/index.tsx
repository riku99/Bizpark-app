import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorModeValue } from 'native-base';
import { MainStack } from './Main';
import { AuthStack } from './Auth';
import { useLoggedIn } from 'src/hooks/me';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const loggedIn = useLoggedIn();

  return (
    <>
      <StatusBar style={useColorModeValue('dark', 'light')} />
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

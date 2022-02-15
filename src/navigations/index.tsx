import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from 'src/types';
import { useColorModeValue } from 'native-base';
import { meVar } from 'src/stores/me';
import { useReactiveVar } from '@apollo/client';
import { MainStack } from './Main';
import { AuthStack } from './Auth';

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = React.memo(() => {
  const loggedIn = useReactiveVar(meVar.loggedIn);

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

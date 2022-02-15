import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationHeaderStyle } from 'src/hooks/theme';
import { OneOnOneTalkRoomScreen } from 'src/screens/OneOnOneTalkRoom';

export type OneOnOneTalkRoomStackParamList = {
  OneOnOneTalkRoomMain: {
    id: number;
    user?: {
      name: string;
    };
  };
};

const Stack = createNativeStackNavigator<OneOnOneTalkRoomStackParamList>();

export const OneOnOneTalkRoomStack = React.memo(() => {
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
      <Stack.Screen
        name="OneOnOneTalkRoomMain"
        component={OneOnOneTalkRoomScreen}
      />
    </Stack.Navigator>
  );
});

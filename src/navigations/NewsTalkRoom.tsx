import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewsTalkRoomScreen } from 'src/screens/NewsTalkRoom';
import { useNavigationHeaderStyle } from 'src/hooks/theme';
import { NewsTalkRoomMembersScreen } from 'src/screens/NewsTalkRoomMembers';

export type NewsTalkRoomStackParamList = {
  NewsTalkRoomMain: {
    id: number;
  };
  NewsTalkRoomMembers: {
    talkRoomId: number;
  };
};

const Stack = createNativeStackNavigator<NewsTalkRoomStackParamList>();

export const NewsTalkRoomStack = React.memo(() => {
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
      <Stack.Screen name="NewsTalkRoomMain" component={NewsTalkRoomScreen} />
      <Stack.Screen
        name="NewsTalkRoomMembers"
        component={NewsTalkRoomMembersScreen}
      />
    </Stack.Navigator>
  );
});

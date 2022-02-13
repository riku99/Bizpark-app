import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThoughtTalkRoomScreen } from 'src/screens/ThoughtTalkRoom';
import { useNavigationHeaderStyle } from 'src/hooks/theme';
import { TalkRoomMembersScreen } from 'src/screens/ThoughtTalkRoomMembers';

export type ThoughtTalkRoomStackParamList = {
  ThoughtTalkRoomMain: {
    id: number;
  };
  ThoughtTalkRoomMembers: {
    talkRoomId: number;
  };
};

const Stack = createNativeStackNavigator<ThoughtTalkRoomStackParamList>();

export const ThoughtTalkRoomStack = React.memo(() => {
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
        name="ThoughtTalkRoomMain"
        component={ThoughtTalkRoomScreen}
      />
      <Stack.Screen
        name="ThoughtTalkRoomMembers"
        component={TalkRoomMembersScreen}
      />
    </Stack.Navigator>
  );
});

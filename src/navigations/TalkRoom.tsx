import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TalkRoomScreen } from "src/screens/TalkRoom";
import { useNavigationHeaderStyle } from "src/hooks/theme";
import { TalkRoomMembersScreen } from "src/screens/TalkRoomMembers";

export type TalkRoomStackParamList = {
  TalkRoomMain: {
    id: number;
  };
  TalkRoomMembers: {
    talkRoomId: number;
  };
};

const Stack = createNativeStackNavigator<TalkRoomStackParamList>();

export const TalkRoomStack = React.memo(() => {
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
      <Stack.Screen name="TalkRoomMain" component={TalkRoomScreen} />
      <Stack.Screen name="TalkRoomMembers" component={TalkRoomMembersScreen} />
    </Stack.Navigator>
  );
});

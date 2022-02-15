import React from 'react';
import { BottomTab } from './Tab';
import { RootStackParamList } from 'src/types';
import { useColorModeValue, useTheme } from 'native-base';
import { ThoughtScreen } from 'src/screens/Thought';
import { ThoughtWritingScreen } from 'src/screens/ThoughtWriting';
import { ThoughtShareScreen } from 'src/screens/ThoughtShare';
import { NewsWebViewScreen } from 'src/screens/NewsWebView';
import { UserEditScreen } from 'src/screens/UserEdit';
import { UserItemEditScreen } from 'src/screens/UserItemEdit';
import { UserProfileScreen } from 'src/screens/UserProfile';
import { Settings } from './Settings';
import { ThoughtTalkRoomStack } from './ThoughtTalkRoom';
import { NewsTalkRoomStack } from './NewsTalkRoom';
import { OneOnOneTalkRoomStack } from './OneOnOneTalkRoom';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainStack = () => {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
          },
          headerTitleStyle: {
            color: useColorModeValue(colors.textBlack, 'white'),
          },
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Tab"
          component={BottomTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Thought" component={ThoughtScreen} />
        <Stack.Screen name="NewsWebView" component={NewsWebViewScreen} />
        <Stack.Screen name="UserEdit" component={UserEditScreen} />
        <Stack.Screen name="UserItemEdit" component={UserItemEditScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen
          name="ThoughtTalkRoom"
          component={ThoughtTalkRoomStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsTalkRoom"
          component={NewsTalkRoomStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OneOnOneTalkRoom"
          component={OneOnOneTalkRoomStack}
          options={{ headerShown: false }}
        />
        <Stack.Group
          screenOptions={{
            presentation: 'modal',
          }}
        >
          <Stack.Screen
            name="ThoughtWriting"
            component={ThoughtWritingScreen}
          />
          <Stack.Screen name="ThoughtShare" component={ThoughtShareScreen} />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
};

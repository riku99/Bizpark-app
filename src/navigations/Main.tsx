import React, { useEffect } from 'react';
import { BottomTab } from './Tab';
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
import { NavigatorScreenParams } from '@react-navigation/native';
import { ThoughtTalkRoomStackParamList } from 'src/navigations/ThoughtTalkRoom';
import { NewsTalkRoomStackParamList } from 'src/navigations/NewsTalkRoom';
import { OneOnOneTalkRoomStackParamList } from 'src/navigations/OneOnOneTalkRoom';
import { ThoughtShare, Socials } from 'src/types';
import { useToughtTalkRoomsWithSubsciption } from 'src/hooks/thoughtTalkRoom';
import { useActiveData } from 'src/hooks/active';
import { useNewsTalkRoomsWithSusbscription } from 'src/hooks/newsTalkRoom';
import { useOneOnOneTalkRoomsWithSubscription } from 'src/hooks/oneOnOneTalkRoom';
import { useDeviceToken } from 'src/hooks/pushNotificatoins';
import { requestUserPermission } from 'src/helpers/pushNotifications';
import { useInitialDataLazyQuery } from 'src/generated/graphql';
import FastImage from 'react-native-fast-image';
import { useApolloClient } from '@apollo/client';
import { useLoggedIn } from 'src/hooks/me';
import { NotificationsScreen } from 'src/screens/Notifications';
import { TabOrderChangeScreen } from 'src/screens/TabOrderChange';
import { NewsTabOrderChangeScreen } from 'src/screens/NewsTabOrderChange';
import { IAPScreen } from 'src/screens/IAP';

export type MainStackParamList = {
  Tab: undefined;
  Signup: undefined;
  Signin: undefined;
  MailForm: {
    type: 'signUp' | 'signIn';
  };
  Thought: {
    id: string;
  };
  ThoughtWriting: undefined;
  ThoughtShare: ThoughtShare;
  NewsWebView: {
    id: number;
  };
  UserEdit: undefined;
  UserItemEdit: {
    type: 'name' | 'bio' | Socials;
    value: string | null;
    setValue: (v: string | null) => void;
  };
  UserProfile: {
    id: string;
  };
  Settings: undefined;
  Notifications: undefined;
  TabOrderChange: undefined;
  NewsTabOrderChange: undefined;
  IAP: undefined;
  ThoughtTalkRoom: NavigatorScreenParams<ThoughtTalkRoomStackParamList>;
  NewsTalkRoom: NavigatorScreenParams<NewsTalkRoomStackParamList>;
  OneOnOneTalkRoom: NavigatorScreenParams<OneOnOneTalkRoomStackParamList>;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = React.memo(() => {
  const { loggedIn, checkedStorage } = useLoggedIn();

  const { colors } = useTheme();

  const client = useApolloClient();

  const [initialDataQuery, { called }] = useInitialDataLazyQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'standby',
  });

  useEffect(() => {
    (async function () {
      if (!called) {
        const { data } = await initialDataQuery();
        if (data) {
          if (data.me.imageUrl) {
            FastImage.preload([
              {
                uri: data.me.imageUrl,
              },
            ]);
          }
        }
      }
    })();
  }, [called, initialDataQuery]);

  useEffect(() => {
    (async function () {
      if (!loggedIn && checkedStorage && called) {
        await client.clearStore();
        console.log('🧹 clear cache');
      }
    })();
  }, [loggedIn, called, client]);

  useActiveData();
  useToughtTalkRoomsWithSubsciption();
  useNewsTalkRoomsWithSusbscription();
  useOneOnOneTalkRoomsWithSubscription();
  useDeviceToken();

  // 通知許可はワークスルーで表示するようにする
  useEffect(() => {
    (async function () {
      await requestUserPermission();
    })();
  }, []);

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
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="IAP" component={IAPScreen} />
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
          <Stack.Screen
            name="TabOrderChange"
            component={TabOrderChangeScreen}
          />
          <Stack.Screen
            name="NewsTabOrderChange"
            component={NewsTabOrderChangeScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </>
  );
});

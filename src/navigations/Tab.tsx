import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { MyPageStack } from './MyPage';
import { TalkListScreen } from 'src/screens/TalkRoomList';
import { NewsScreen } from 'src/screens/News';
import { useColorModeValue, useTheme, Box } from 'native-base';
import React, { useMemo } from 'react';
import { HomeStack } from './Home';
import {
  useGetThoughtTalkRoomsQuery,
  useGetNewsTalkRoomsQuery,
  useGetOneOnOneTalkRoomsQuery,
} from 'src/generated/graphql';
import { Badge } from 'src/components/Badge';
import { StyleSheet } from 'react-native';

export type TabParamList = {
  Home: undefined;
  News: undefined;
  Talk: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTab = React.memo(() => {
  const { colors } = useTheme();

  const { data: thoughtTalkRoomData } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const { data: newsTalkRoomData } = useGetNewsTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const { data: oneOnOneTalkRoomData } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const notThoughtTalkRoomAllSeen = useMemo(() => {
    if (!thoughtTalkRoomData) {
      return false;
    }

    return thoughtTalkRoomData.thoughtTalkRooms.some(
      (room) => !room.allMessageSeen
    );
  }, [thoughtTalkRoomData]);

  const notNewsTalkRoomAllSeen = useMemo(() => {
    if (!newsTalkRoomData) {
      return false;
    }

    return newsTalkRoomData.newsTalkRooms.find((room) => !room.allMessageSeen);
  }, [newsTalkRoomData]);

  const notOneOnOneTalkRoomAllSeen = useMemo(() => {
    if (!oneOnOneTalkRoomData) {
      return false;
    }
    return oneOnOneTalkRoomData.oneOnOneTalkRooms.find(
      (room) => !room.allMessageSeen
    );
  }, [oneOnOneTalkRoomData]);

  const talkBadgeVisible = useMemo(() => {
    return (
      notThoughtTalkRoomAllSeen ||
      notNewsTalkRoomAllSeen ||
      notOneOnOneTalkRoomAllSeen
    );
  }, [
    notThoughtTalkRoomAllSeen,
    notNewsTalkRoomAllSeen,
    notOneOnOneTalkRoomAllSeen,
  ]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
        headerTitleStyle: {
          color: useColorModeValue(colors.textBlack, 'white'),
        },
        tabBarStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: useColorModeValue('#969696', '#c9c9c9'),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={ICON_SIZE} color={color} />
          ),
          tabBarLabel: '?????????',
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={ICON_SIZE} color={color} />
          ),
          tabBarLabel: '????????????',
        }}
      />
      <Tab.Screen
        name="Talk"
        component={TalkListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Box>
              <AntDesign name="message1" size={ICON_SIZE} color={color} />
              {talkBadgeVisible && <Badge containerStyle={styles.badge} />}
            </Box>
          ),
          tabBarLabel: '?????????',
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageStack}
        options={{
          lazy: false, // MyPage???????????????????????????????????????????????????????????????false
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={ICON_SIZE} color={color} />
          ),
          tabBarLabel: '???????????????',
        }}
      />
    </Tab.Navigator>
  );
});

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 0,
    transform: [{ translateX: 10 }],
  },
});

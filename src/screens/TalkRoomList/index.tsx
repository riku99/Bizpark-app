import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Box } from 'native-base';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from 'src/components/Badge';
import {
  useGetNewsTalkRoomsQuery,
  useGetOneOnOneTalkRoomsQuery,
  useGetThoughtTalkRoomsQuery,
} from 'src/generated/graphql';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { mmkvStorageKeys, storage } from 'src/storage/mmkv';
import { RootNavigationScreenProp } from 'src/types';
import { ActiveTalkRoomPopUp } from './ActiveTalkRoomPopUp';
import { NewsTalkRoomList } from './NewsTalkRoomList';
import { OneOnOneTalkRoomList } from './OneOnOneTalkRoomList';
import { ThoughtTalkRoomList } from './ThoughtTalkRoomList';

type Props = RootNavigationScreenProp<'Tab'>;

const TopTab = createMaterialTopTabNavigator();

export const TalkListScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerShown: false,
      headerShadowVisible: false,
    });
  }, []);

  const [activeTalkRoomPopUpVisible, setActiveTalkRoomPopUpVisible] =
    useState(false);

  useEffect(() => {
    const isDisplayed = storage.getBoolean(
      mmkvStorageKeys.displayedActiveTalkRoomPopUp
    );

    if (!isDisplayed) {
      setActiveTalkRoomPopUpVisible(true);
      storage.set(mmkvStorageKeys.displayedActiveTalkRoomPopUp, true);
    }
  }, []);

  const { defaultScreenStyle, style, sceneContainerStyle } =
    useTopTabBarStyle();

  const { top } = useSafeAreaInsets();

  const renderBadge = useCallback(() => {
    return (
      <Box position="absolute" top="4" right="4">
        <Badge />
      </Box>
    );
  }, []);

  const { data: thoughtTalkRoomData } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const { data: newsTalkRoomData } = useGetNewsTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const { data: oneOnOneTalkRoomData } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const shareBadgeVisible = useMemo(() => {
    if (!thoughtTalkRoomData) {
      return false;
    }

    return thoughtTalkRoomData.thoughtTalkRooms.find(
      (room) => !room.allMessageSeen
    );
  }, [thoughtTalkRoomData]);

  const newsBadgeVisible = useMemo(() => {
    if (!newsTalkRoomData) {
      return false;
    }

    return newsTalkRoomData.newsTalkRooms.find((room) => !room.allMessageSeen);
  }, [newsTalkRoomData]);

  const userBadgeVisible = useMemo(() => {
    if (!oneOnOneTalkRoomData) {
      return false;
    }
    return oneOnOneTalkRoomData.oneOnOneTalkRooms.find(
      (room) => !room.allMessageSeen
    );
  }, [oneOnOneTalkRoomData]);

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          lazy: true,
          ...defaultScreenStyle,
        }}
        style={{
          marginTop: top,
          ...style,
        }}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen
          name="ThoughtTalkRoomList"
          component={ThoughtTalkRoomList}
          options={{
            tabBarLabel: '投稿',
            tabBarBadge: shareBadgeVisible ? renderBadge : undefined,
          }}
        />
        <TopTab.Screen
          name="NewsTalkRoomList"
          component={NewsTalkRoomList}
          options={{
            tabBarLabel: 'ニュース',
            tabBarBadge: newsBadgeVisible ? renderBadge : undefined,
          }}
        />
        <TopTab.Screen
          name="OneOnOneTalkRoomList"
          component={OneOnOneTalkRoomList}
          options={{
            tabBarLabel: 'ユーザー',
            tabBarBadge: userBadgeVisible ? renderBadge : undefined,
          }}
        />
      </TopTab.Navigator>

      <ActiveTalkRoomPopUp
        isVisible={activeTalkRoomPopUpVisible}
        hidePopUp={() => {
          setActiveTalkRoomPopUpVisible(false);
        }}
      />
    </>
  );
};

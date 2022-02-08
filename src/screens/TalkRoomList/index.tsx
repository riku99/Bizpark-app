import React, { useLayoutEffect, useMemo, useCallback } from "react";
import { RootNavigationScreenProp } from "src/types";
import { ThoughtTalkRoomList } from "./ThoughtTalkRoomList";
import { NewsTalkRoomList } from "./NewsTalkRoomList";
import { OneOnOneTalkRoomList } from "./OneOnOneTalkRoomList";
import { useTopTabBarStyle } from "src/hooks/theme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "src/components/Badge";
import {
  useGetNewsTalkRoomsQuery,
  useGetThoughtTalkRoomsQuery,
} from "src/generated/graphql";
import { Box } from "native-base";

type Props = RootNavigationScreenProp<"Tab">;

const TopTab = createMaterialTopTabNavigator();

export const TalkListScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerShown: false,
      headerShadowVisible: false,
    });
  }, []);

  const {
    defaultScreenStyle,
    style,
    sceneContainerStyle,
  } = useTopTabBarStyle();

  const { top } = useSafeAreaInsets();

  const renderBadge = useCallback(() => {
    return (
      <Box position="absolute" top="4" right="4">
        <Badge />
      </Box>
    );
  }, []);

  const { data: thoughtTalkRoomData } = useGetThoughtTalkRoomsQuery();

  const { data: newsTalkRoomData } = useGetNewsTalkRoomsQuery();

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
            tabBarLabel: "シェア",
            tabBarBadge: shareBadgeVisible ? renderBadge : undefined,
          }}
        />
        <TopTab.Screen
          name="NewsTalkRoomList"
          component={NewsTalkRoomList}
          options={{
            tabBarLabel: "ニュース",
            tabBarBadge: newsBadgeVisible ? renderBadge : undefined,
          }}
        />
        <TopTab.Screen
          name="OneOnOneTalkRoomList"
          component={OneOnOneTalkRoomList}
          options={{
            tabBarLabel: "ユーザー",
          }}
        />
      </TopTab.Navigator>
    </>
  );
};

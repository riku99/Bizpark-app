import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { MyPageStack } from "./MyPage";
import { TalkListScreen } from "src/screens/TalkRoomList";
import { NewsScreen } from "src/screens/News";
import { useColorModeValue, useTheme, Box } from "native-base";
import React, { useMemo } from "react";
import { HomeStack } from "./Home";
import {
  useGetThoughtTalkRoomsQuery,
  useGetNewsTalkRoomMessagesQuery,
  useGetNewsTalkRoomsQuery,
} from "src/generated/graphql";
import { Badge } from "src/components/Badge";
import { StyleSheet } from "react-native";
import { useToughtTalkRoomsWithSubsciption } from "src/hooks/thoughtTalkRoom";
import { useActiveData } from "src/hooks/active";
import { useNewsTalkRoomsWithSusbscription } from "src/hooks/newsTalkRoom";

type TabParamList = {
  Home: undefined;
  News: undefined;
  Talk: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTab = () => {
  const { colors } = useTheme();

  const { data: thoughtTalkRoomData } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: "cache-only",
  });

  const { data: newsTalkRoomsData } = useGetNewsTalkRoomsQuery({
    fetchPolicy: "cache-only",
  });

  const talkTabBadge = useMemo(() => {
    if (!thoughtTalkRoomData || !newsTalkRoomsData) {
      return false;
    }

    const notSeenMessageThoughtTalkRoom = thoughtTalkRoomData.thoughtTalkRooms.filter(
      (room) => !room.allMessageSeen
    );

    const notSeenMessageNewsTalkRoom = newsTalkRoomsData.newsTalkRooms.filter(
      (room) => !room.allMessageSeen
    );

    return (
      !!notSeenMessageThoughtTalkRoom.length ||
      !!notSeenMessageNewsTalkRoom.length
    );
  }, [thoughtTalkRoomData, newsTalkRoomsData]);

  useActiveData();
  useToughtTalkRoomsWithSubsciption();
  useNewsTalkRoomsWithSusbscription();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
        headerTitleStyle: {
          color: useColorModeValue(colors.textBlack, "white"),
        },
        tabBarStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
        tabBarActiveTintColor: colors.pink,
        tabBarInactiveTintColor: useColorModeValue("#969696", "#c9c9c9"),
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
          tabBarLabel: "ホーム",
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={ICON_SIZE} color={color} />
          ),
          tabBarLabel: "ニュース",
        }}
      />
      <Tab.Screen
        name="Talk"
        component={TalkListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Box>
              <AntDesign name="message1" size={ICON_SIZE} color={color} />
              {talkTabBadge && <Badge containerStyle={styles.badge} />}
            </Box>
          ),
          tabBarLabel: "トーク",
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageStack}
        options={{
          lazy: false, // MyPage表示させるときチラつかせたくないのでここはfalse
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={ICON_SIZE} color={color} />
          ),
          tabBarLabel: "マイページ",
        }}
      />
    </Tab.Navigator>
  );
};

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: 0,
    transform: [{ translateX: 10 }],
  },
});

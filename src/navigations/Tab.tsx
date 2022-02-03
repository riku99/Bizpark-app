import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { MyPageStack } from "./MyPage";
import { TalkListScreen } from "src/screens/TalkRoomList";
import { NewsScreen } from "src/screens/News";
import { useColorModeValue, useTheme, Box } from "native-base";
import React, { useMemo } from "react";
import { HomeStack } from "./Home";
import { useGetThoughtTalkRoomsQuery } from "src/generated/graphql";
import { Badge } from "src/components/Badge";
import { StyleSheet } from "react-native";
import { useToughtTalkRoomsWithSubsciption } from "src/hooks/thoughtTalkRoom";
import { useActiveData } from "src/hooks/active";

type TabParamList = {
  Home: undefined;
  News: undefined;
  Talk: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTab = () => {
  const { colors } = useTheme();

  const { data } = useGetThoughtTalkRoomsQuery({
    fetchPolicy: "cache-only",
  });

  const talkTabBadge = useMemo(() => {
    if (data) {
      const hasNotSeenMessageRoom = data.thoughtTalkRooms.filter(
        (room) => !room.allMessageSeen
      );

      return !!hasNotSeenMessageRoom.length;
    }
  }, [data]);

  useToughtTalkRoomsWithSubsciption();
  useActiveData();

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

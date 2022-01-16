import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { MyPage } from "src/screens/MyPage";
import { MyPageStack } from "./MyPage";
import { TalkListScreen } from "src/screens/TalkList";
import { NewsScreen } from "src/screens/News";
import { useColorModeValue, useTheme } from "native-base";
import React from "react";
import { HomeStack } from "./Home";

type TabParamList = {
  Home: undefined;
  News: undefined;
  Talk: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTab = () => {
  const { colors } = useTheme();

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
            <AntDesign name="message1" size={ICON_SIZE} color={color} />
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

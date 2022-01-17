import { Box } from "native-base";
import React, { useLayoutEffect } from "react";
import { RootNavigationScreenProp } from "src/types";
import { ThoughtTalkRoomList } from "./ThoughtTalkRoomList";
import { NewsTalkRoomList } from "./NewsTalkRoomList";
import { OneOnOneTalkRoomList } from "./OneOnOneTalkRoomList";
import { useTopTabBarStyle } from "src/hooks/theme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          }}
        />
        <TopTab.Screen
          name="NewsTalkRoomList"
          component={NewsTalkRoomList}
          options={{
            tabBarLabel: "ニュース",
          }}
        />
        <TopTab.Screen
          name="OneOnOneTalkRoomList"
          component={OneOnOneTalkRoomList}
          options={{
            tabBarLabel: "個人",
          }}
        />
      </TopTab.Navigator>
    </>
  );
};

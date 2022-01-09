import React, { useLayoutEffect } from "react";
import { AddButton } from "src/components/AddButton";
import { CreatingToast } from "src/components/CreatingToast";
import { useReactiveVar } from "@apollo/client";
import { creatingThoughtVar } from "src/stores/thought";
import { RootNavigationScreenProp } from "src/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTopTabBarStyle } from "src/hooks/theme";
import { Picks } from "./Picks";
import { Thouhgts } from "./Thoughts";
import { Follows } from "./Follows";
import { MyProfile } from "./Profile";

type Props = RootNavigationScreenProp<"Tab">;

const TopTab = createMaterialTopTabNavigator();

export const MyPage = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
    });
  }, []);

  const {
    defaultScreenStyle,
    style,
    sceneContainerStyle,
  } = useTopTabBarStyle();

  const creatingThought = useReactiveVar(creatingThoughtVar);

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          ...defaultScreenStyle,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "bold",
          },
          lazy: true,
        }}
        style={{
          ...style,
        }}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen name="プロフィール" component={MyProfile} />
        <TopTab.Screen name="マイピックス" component={Picks} />
        <TopTab.Screen name="フォロー" component={Follows} />
        <TopTab.Screen name="シェア" component={Thouhgts} />
      </TopTab.Navigator>
      <AddButton />

      {creatingThought && (
        <CreatingToast
          position="absolute"
          top={6}
          alignSelf="center"
          onClosePress={() => {
            creatingThoughtVar(false);
          }}
        />
      )}
    </>
  );
};

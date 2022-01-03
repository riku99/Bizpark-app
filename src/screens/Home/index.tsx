import React, { useLayoutEffect } from "react";
import { useColorMode, Button } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Society } from "./Society";
import { Business } from "./Business";
import { Economy } from "./Economy";
import { Politics } from "./Politics";
import { useTopTabBarStyle } from "src/hooks/theme";
import { useSignOut } from "src/hooks/auth";
import { AddButton } from "src/components/AddButton";

type Props = RootNavigationScreenProp<"Tab">;

const TopTab = createMaterialTopTabNavigator();

export const HomeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
      // headerLeft: () => <Text>Logo</Text>,
    });
  }, [navigation]);
  const { toggleColorMode } = useColorMode();

  const {
    defaultScreenStyle,
    style,
    sceneContainerStyle,
  } = useTopTabBarStyle();

  const { signOut } = useSignOut();

  const onSubButtonPress = async () => {
    toggleColorMode();
    // await signOut();
  };

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          lazy: true,
          ...defaultScreenStyle,
        }}
        style={style}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen
          name="Business"
          component={Business}
          options={{
            tabBarLabel: "Business",
          }}
        />
        <TopTab.Screen name="Politics" component={Politics} />
        <TopTab.Screen name="Economy" component={Economy} />
        <TopTab.Screen name="Society" component={Society} />
      </TopTab.Navigator>
      <Button
        position="absolute"
        w={50}
        h={30}
        bottom={30}
        onPress={onSubButtonPress}
      >
        toggle
      </Button>

      <AddButton />
    </>
  );
};

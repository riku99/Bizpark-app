import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { ThoughtScreen } from "src/screens/Thought";
import { SharedImageScreen } from "src/screens/SharedImage";
import { useColorModeValue, useTheme } from "native-base";

const Stack = createSharedElementStackNavigator();

export const ThoughtNavigation = React.memo(() => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: useColorModeValue(colors.lt.bg, colors.dt.bg),
        },
        headerTitleStyle: {
          color: useColorModeValue(colors.textBlack, "white"),
        },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Thought" component={ThoughtScreen} />
      <Stack.Screen
        name="SharedImage"
        component={SharedImageScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { item } = route.params;
          return [`item.${item.id}.photo`];
        }}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
});

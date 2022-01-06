import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { ThoughtScreen } from "src/screens/Thought";
import { SharedImageScreen } from "src/screens/SharedImage";

const Stack = createSharedElementStackNavigator();

export const ThoughtNavigation = React.memo(() => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Thought"
        component={ThoughtScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SharedImage"
        component={SharedImageScreen}
        sharedElements={(route, otherRoute, showing) => {
          const { item } = route.params;
          return [`item.${item.id}.photo`];
        }}
      />
    </Stack.Navigator>
  );
});

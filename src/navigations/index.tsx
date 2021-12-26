import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BottomTab } from "./Tab";

const Stack = createNativeStackNavigator();

export const RootNavigation = React.memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

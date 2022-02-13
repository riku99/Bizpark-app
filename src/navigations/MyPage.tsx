import { MyPage } from 'src/screens/MyPage';
import React from 'react';
import { UserProfileScreen } from 'src/screens/UserProfile';
import { useNavigationHeaderStyle } from 'src/hooks/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const MyPageStack = React.memo(() => {
  const { headerStyle, headerTitleStyle } = useNavigationHeaderStyle();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle,
        headerTitleStyle,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MyPageMain" component={MyPage} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
});

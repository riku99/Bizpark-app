import React, { useLayoutEffect } from 'react';
import { useColorMode, Button, Box } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Society } from './Society';
import { Business } from './Business';
import { Economy } from './Economy';
import { Politics } from './Politics';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { AddButton } from 'src/components/AddButton';
import { CreatingToast } from 'src/components/CreatingToast';
import { useReactiveVar } from '@apollo/client';
import { creatingThoughtVar } from 'src/stores/thought';
import { Follow } from './Follow';
import { useFcmHandler } from 'src/hooks/pushNotificatoins';

type Props = RootNavigationScreenProp<'Tab'>;

const TopTab = createMaterialTopTabNavigator();

export const HomeScreen = React.memo(({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: '',
      // headerLeft: () => <Text>Logo</Text>,
    });
  }, [navigation]);
  const { toggleColorMode } = useColorMode();

  const { defaultScreenStyle, style, sceneContainerStyle } =
    useTopTabBarStyle();

  const onSubButtonPress = async () => {
    toggleColorMode();
  };

  const creatingThought = useReactiveVar(creatingThoughtVar);

  useFcmHandler();

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          lazy: true,
          tabBarScrollEnabled: true,
          ...defaultScreenStyle,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          tabBarItemStyle: {
            width: 90,
          },
        }}
        style={style}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen
          name="Business"
          component={Business}
          options={{
            tabBarLabel: 'ビジネス',
          }}
        />
        <TopTab.Screen
          name="Politics"
          component={Politics}
          options={{ tabBarLabel: '政治' }}
        />
        <TopTab.Screen
          name="Economy"
          component={Economy}
          options={{
            tabBarLabel: '金融・経済',
          }}
        />
        <TopTab.Screen
          name="Society"
          component={Society}
          options={{
            tabBarLabel: '社会',
          }}
        />
        <TopTab.Screen
          name="Follow"
          component={Follow}
          options={{
            tabBarLabel: 'フォロー',
          }}
        />
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

      {creatingThought && (
        <CreatingToast
          position="absolute"
          top={16}
          alignSelf="center"
          onClosePress={() => {
            creatingThoughtVar(false);
          }}
        />
      )}
    </>
  );
});

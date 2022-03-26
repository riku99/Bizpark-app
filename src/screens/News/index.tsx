import React, { useLayoutEffect } from 'react';
import { RootNavigationScreenProp } from 'src/types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { Business } from './Business';
import { Politics } from './Politics';
import { Economy } from './Economy';
import { Technology } from './Technology';
import { HeaderRight } from './HeaderRight';

type Props = {} & RootNavigationScreenProp<'Tab'>;

const TopTab = createMaterialTopTabNavigator();

export const NewsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: '',
      headerRight: () => <HeaderRight />,
    });
  }, [navigation]);

  const { defaultScreenStyle, style, sceneContainerStyle } =
    useTopTabBarStyle();

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          ...defaultScreenStyle,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: 'bold',
          },
          lazy: true,
        }}
        style={style}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen name="ビジネス" component={Business} />
        <TopTab.Screen name="政治" component={Politics} />
        <TopTab.Screen name="経済" component={Economy} />
        <TopTab.Screen name="テクノロジー" component={Technology} />
      </TopTab.Navigator>
    </>
  );
};

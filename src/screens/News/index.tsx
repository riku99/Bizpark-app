import React, { useLayoutEffect } from 'react';
import { RootNavigationScreenProp } from 'src/types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { Business } from './Business';
import { Politics } from './Politics';
import { Economy } from './Economy';
import { Technology } from './Technology';
import { HeaderRight } from './HeaderRight';
import { useNewsTabOrder } from 'src/hooks/newsTabOrder';

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

  const { newsTabOrder } = useNewsTabOrder();

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
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 100,
          },
        }}
        style={style}
        sceneContainerStyle={sceneContainerStyle}
      >
        {newsTabOrder.map(({ key, label }) => {
          switch (key) {
            case 'Business':
              return (
                <TopTab.Screen
                  name={key}
                  component={Business}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
            case 'Politics':
              return (
                <TopTab.Screen
                  name={key}
                  component={Politics}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
            case 'Economy':
              return (
                <TopTab.Screen
                  name={key}
                  component={Economy}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
            case 'Technology':
              return (
                <TopTab.Screen
                  name={key}
                  component={Technology}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
          }
        })}
      </TopTab.Navigator>
    </>
  );
};

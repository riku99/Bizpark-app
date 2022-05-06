import { useReactiveVar } from '@apollo/client';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useLayoutEffect } from 'react';
import { CreatingToast } from 'src/components/CreatingToast';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { creatingThoughtVar } from 'src/stores/thought';
import { RootNavigationScreenProp } from 'src/types';
import { Follows } from './Follows';
import { HeaderRight } from './HeaderRight';
import { Picks } from './Picks';
import { MyProfile } from './Profile';
import { Thouhgts } from './Thoughts';

type Props = RootNavigationScreenProp<'Tab'>;

const TopTab = createMaterialTopTabNavigator();

export const MyPage = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: '',
      headerRight: () => <HeaderRight />,
    });
  }, [navigation]);

  const { defaultScreenStyle, style, sceneContainerStyle } =
    useTopTabBarStyle();

  const creatingThought = useReactiveVar(creatingThoughtVar);

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          ...defaultScreenStyle,
          tabBarScrollEnabled: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: 'bold',
          },
          lazy: true,
          tabBarItemStyle: {
            width: 105,
          },
        }}
        style={{
          ...style,
        }}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen name="プロフィール" component={MyProfile} />
        <TopTab.Screen name="コレクション" component={Picks} />
        <TopTab.Screen name="フォロー" component={Follows} />
        <TopTab.Screen name="投稿" component={Thouhgts} />
      </TopTab.Navigator>

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

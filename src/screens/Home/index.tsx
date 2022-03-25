import React, { useLayoutEffect } from 'react';
import { useColorMode, Button } from 'native-base';
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
import { HeaderRight } from './HeaderRight';
import { tabOrderVar } from 'src/stores/tabOrder';
import { TopTabParamList } from './types';

type Props = RootNavigationScreenProp<'Tab'>;

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

export const HomeScreen = React.memo(({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: '',
      headerRight: () => <HeaderRight />,
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
  const tabOrder = useReactiveVar(tabOrderVar);

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
        {tabOrder.map(({ key, label }) => {
          switch (key) {
            case 'Business':
              return (
                <TopTab.Screen
                  name="Business"
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
                  name="Politics"
                  component={Politics}
                  options={{ tabBarLabel: label }}
                  key={key}
                />
              );
            case 'Economy':
              return (
                <TopTab.Screen
                  name="Economy"
                  component={Economy}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
            case 'Society':
              return (
                <TopTab.Screen
                  name="Society"
                  component={Society}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
            case 'Follow':
              return (
                <TopTab.Screen
                  name="Follow"
                  component={Follow}
                  options={{
                    tabBarLabel: label,
                  }}
                  key={key}
                />
              );
          }
        })}
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

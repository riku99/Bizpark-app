import React, { useLayoutEffect, useState, useCallback } from 'react';
import { useColorModeValue, useTheme } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import {
  useUserQuery,
  useMeQuery,
  UserProfileFragment,
  UserProfileFragmentDoc,
} from 'src/generated/graphql';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from 'react-native-toast-notifications';
import { useUnblock, useBlock } from 'src/hooks/users';
import { useApolloClient } from '@apollo/client';
import { Menu } from './Menu';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { UserProfile } from './Profile';
import { Thoughts } from './Thoughts';

type Props = RootNavigationScreenProp<'UserProfile'>;

const TopTab = createMaterialTopTabNavigator();

// MyPageで表示するプロフィール以外のプロフィール画面
export const UserProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const { cache } = useApolloClient();

  const toast = useToast();

  const cacheData = cache.readFragment<UserProfileFragment>({
    id: cache.identify({
      __typename: 'User',
      id,
    }),
    fragment: UserProfileFragmentDoc,
  });

  const { data, loading } = useUserQuery({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const {
    data: { me },
  } = useMeQuery();

  const isMe = me.id === id;

  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        !data && !loading
          ? 'ユーザーが存在しません'
          : data?.user.name ?? cacheData.name,
      headerRight:
        (cacheData || data) && !isMe
          ? () => (
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={iconColor}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            )
          : undefined,
    });
  }, [iconColor, isMe, loading, cacheData, data]);

  const { defaultScreenStyle, style, sceneContainerStyle } =
    useTopTabBarStyle();

  const renderProfile = useCallback(() => {
    return <UserProfile id={id} />;
  }, [id]);

  const renderThoughts = useCallback(() => {
    return <Thoughts id={id} />;
  }, [id]);

  const [blockMutation] = useBlock();
  const [unblockMutation] = useUnblock();

  const onBlockPress = async () => {
    try {
      await blockMutation({
        variables: {
          blockTo: id,
        },
      });

      toast.show('ブロックしました', { type: 'success' });
    } catch (e) {}
  };

  const onUnBlockPress = async () => {
    try {
      await unblockMutation({
        variables: {
          blockedUserId: id,
        },
      });

      toast.show('解除しました', { type: 'success' });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <TopTab.Navigator
        screenOptions={{
          ...defaultScreenStyle,
          lazy: true,
        }}
        style={style}
        sceneContainerStyle={sceneContainerStyle}
      >
        <TopTab.Screen name="プロフィール" component={renderProfile} />
        <TopTab.Screen name="投稿" component={renderThoughts} />
      </TopTab.Navigator>

      <Menu
        isVisible={modalVisible}
        closeMenu={closeModal}
        userId={id}
        blocking={data?.user.blocking}
        onBlockPress={onBlockPress}
        onUnBlockPress={onUnBlockPress}
      />
    </>
  );
};

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorModeValue, useTheme } from 'native-base';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { UserGetError, useUserQuery } from 'src/generated/graphql';
import { useMyId } from 'src/hooks/me';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { useBlock, useUnblock } from 'src/hooks/users';
import { RootNavigationScreenProp } from 'src/types';
import { getGraphQLError } from 'src/utils';
import { Menu } from './Menu';
import { UserProfile } from './Profile';
import { Thoughts } from './Thoughts';

type Props = RootNavigationScreenProp<'UserProfile'>;

const TopTab = createMaterialTopTabNavigator();

// MyPageで表示するプロフィール以外のプロフィール画面
export const UserProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const toast = useToast();

  const { data, loading } = useUserQuery({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    onError: (errors) => {
      const error = getGraphQLError(errors, 0);

      if (error) {
        if (error.code === UserGetError.NotFound) {
          Alert.alert('ユーザーが見つかりません', '', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        }
      }
    },
  });

  const myId = useMyId();
  const isMe = id === myId;

  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.user.name || '',
      headerRight:
        data && !isMe
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
  }, [iconColor, isMe, loading, data, navigation]);

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

      {data && (
        <Menu
          isVisible={modalVisible}
          closeMenu={closeModal}
          userId={id}
          blocking={data.user.blocking}
          onBlockPress={onBlockPress}
          onUnBlockPress={onUnBlockPress}
        />
      )}
    </>
  );
};

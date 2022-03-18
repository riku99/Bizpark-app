import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useColorModeValue, useTheme } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { useUserQuery } from 'src/generated/graphql';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from 'react-native-toast-notifications';
import { useUnblock, useBlock } from 'src/hooks/users';
import { Menu } from './Menu';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTopTabBarStyle } from 'src/hooks/theme';
import { UserProfile } from './Profile';
import { Thoughts } from './Thoughts';
import { useMyId } from 'src/hooks/me';
import { Alert } from 'react-native';

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
  });

  const myId = useMyId();
  const isMe = id === myId;

  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (data?.userResult.__typename === 'Deleted' && !loading) {
      Alert.alert(data.userResult.message, '', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }
  }, [navigation, data, loading]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        data?.userResult.__typename !== 'Deleted' ? data.userResult.name : '',
      headerRight:
        data?.userResult.__typename === 'User' && !isMe
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

      {data?.userResult.__typename === 'User' && (
        <Menu
          isVisible={modalVisible}
          closeMenu={closeModal}
          userId={id}
          blocking={data.userResult.blocking}
          onBlockPress={onBlockPress}
          onUnBlockPress={onUnBlockPress}
        />
      )}
    </>
  );
};

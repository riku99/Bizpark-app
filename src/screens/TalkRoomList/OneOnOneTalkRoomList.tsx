import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Box, Pressable, Text, useColorModeValue, useTheme } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useToast } from 'react-native-toast-notifications';
import { Badge } from 'src/components/Badge';
import {
  InstaLikeModal,
  ListItem as MenuListItem,
} from 'src/components/InstaLikeModal';
import { UserImage } from 'src/components/UserImage';
import {
  GetOneOnOneTalkRoomsQuery,
  useDeleteOneOnOneTalkRoomMutation,
  useGetOneOnOneTalkRoomsQuery,
} from 'src/generated/graphql';
import { useMyId } from 'src/hooks/me';
import { useDeleteOneOnOneTalkRoomFromCache } from 'src/hooks/oneOnOneTalkRoom';
import { RootNavigationProp } from 'src/types';

type Item = GetOneOnOneTalkRoomsQuery['oneOnOneTalkRooms'][number];

export const OneOnOneTalkRoomList = React.memo(() => {
  const { data: talkRoomData } = useGetOneOnOneTalkRoomsQuery({
    fetchPolicy: 'cache-only',
  });

  const { colors } = useTheme();

  const bg = useColorModeValue('lt.bg', 'dt.bg');
  const itemPressedColor = useColorModeValue('lt.pressed', 'dt.pressed');
  const nameColor = useColorModeValue(colors.textBlack, colors.textWhite);
  const messageColor = useColorModeValue(
    colors.lt.textGray,
    colors.dt.textGray
  );

  const myId = useMyId();

  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const [menuData, setMenuData] = useState<{ roomId: number | null }>(null);

  const closeMenu = () => {
    setMenuData(null);
  };

  const [deleteTalkRoomMutation] = useDeleteOneOnOneTalkRoomMutation();

  const { deleteOneOnOneTalkRoomFromCache } =
    useDeleteOneOnOneTalkRoomFromCache();

  const toast = useToast();

  const menuList: MenuListItem[] = [
    {
      title: 'トークルームを削除',
      color: 'red',
      onPress: () => {
        Alert.alert(
          'トークルームを削除',
          'メッセージが全て削除され元に戻すことはできません。削除しますか?',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: '削除',
              style: 'destructive',
              onPress: async () => {
                if (menuData) {
                  try {
                    await deleteTalkRoomMutation({
                      variables: {
                        input: {
                          talkRoomId: menuData.roomId,
                        },
                      },
                    });

                    deleteOneOnOneTalkRoomFromCache({
                      talkRoomId: menuData.roomId,
                    });

                    toast.show('削除しました', { type: 'success' });
                  } catch (e) {
                    console.log(e);
                  } finally {
                    setMenuData(null);
                  }
                }
              },
            },
          ]
        );
      },
    },
  ];

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      if (!myId) {
        return null;
      }

      const { id, allMessageSeen, sender, recipient, messages } = item;

      const lastMessage = messages.edges[0]?.node.text;

      const user = myId === sender.id ? recipient : sender;

      const onPress = () => {
        navigation.navigate('OneOnOneTalkRoom', {
          screen: 'OneOnOneTalkRoomMain',
          params: {
            id,
            user: {
              name: user.name,
            },
          },
        });
      };

      const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setMenuData({ roomId: item.id });
      };

      return (
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          bg={bg}
          _pressed={{ bg: itemPressedColor }}
        >
          <ListItem containerStyle={styles.itemContainer}>
            <UserImage uri={user.imageUrl} size="10" />
            <ListItem.Content>
              <ListItem.Title style={[{ color: nameColor }, styles.title]}>
                {user.name}
              </ListItem.Title>

              <Text color={messageColor} ellipsizeMode="tail" numberOfLines={1}>
                {lastMessage}
              </Text>
            </ListItem.Content>

            {!allMessageSeen && <Badge />}
          </ListItem>
        </Pressable>
      );
    },
    [bg, nameColor, messageColor, itemPressedColor, myId, navigation]
  );

  if (!talkRoomData) {
    return null;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={talkRoomData.oneOnOneTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <InstaLikeModal
        isVisible={!!menuData}
        list={menuList}
        onBackdropPress={closeMenu}
        onCancel={closeMenu}
      />
    </Box>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'transparent',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

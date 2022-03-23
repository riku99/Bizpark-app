import React, {
  useLayoutEffect,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Box, HStack, Text, useColorModeValue, Pressable } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { UserImage } from 'src/components/UserImage';
import {
  useGetNotificationsQuery,
  NotificationType,
  TalkRoomType,
  GetNotificationsQuery,
  useSeeNotificationMutation,
} from 'src/generated/graphql';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useFindThoughtTalkRoom } from 'src/hooks/thoughtTalkRoom';
import { useFindNewsTalkRoom } from 'src/hooks/newsTalkRoom';
import { useFindOneOnOneTalkRoom } from 'src/hooks/oneOnOneTalkRoom';
import { Indicator } from 'src/components/Indicator';
import { StyleSheet } from 'react-native';
import { InfiniteFlatList } from 'src/components/InfiniteFlatList';
import { btoa } from 'react-native-quick-base64';
import { RefreshControl } from 'src/components/RefreshControl';

type Props = RootNavigationScreenProp<'Notifications'>;

type Item = GetNotificationsQuery['notifications']['edges'][number];

const replyMessage = (name: string) => `${name}から返信が届きました。`;
const likeMessage = (name: string) => `${name}がいいねしました。`;
const followMessage = (name: string) => `${name}があなたをフォローしました。`;

export const NotificationsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'お知らせ',
    });
  }, [navigation]);

  const textGray = useColorModeValue('lt.textGray', 'dt.textGray');
  const pressed = useColorModeValue('lt.pressed', 'dt.pressed');

  const {
    data: notificationData,
    fetchMore,
    refetch,
  } = useGetNotificationsQuery();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { findThoughtTalkRoom } = useFindThoughtTalkRoom();
  const { findNewsTalkRoom } = useFindNewsTalkRoom();
  const { findOneOnOneTalkRoom } = useFindOneOnOneTalkRoom();
  const [seeNotificationMutation] = useSeeNotificationMutation();

  useEffect(() => {
    (async () => {
      if (notificationData?.notifications) {
        const firstNode = notificationData.notifications.edges[0]?.node;
        if (firstNode && !firstNode.seen) {
          await seeNotificationMutation({
            variables: {
              id: firstNode.id,
            },
          });
        }
      }
    })();
  }, [notificationData, seeNotificationMutation]);

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      const {
        performer,
        createdAt,
        type: _type,
        talkRoomType,
        talkRoomId,
        thought,
      } = item.node;

      const diff = formatDistanceToNow(new Date(Number(createdAt)), {
        locale: ja,
        addSuffix: true,
      });

      let type: string = '';
      let message: string = '';
      switch (_type) {
        case NotificationType.Reply:
          type = '返信';
          message = replyMessage(performer.name);
          break;
        case NotificationType.Like:
          type = 'いいね';
          message = likeMessage(performer.name);
          break;
        case NotificationType.Follow:
          type = 'フォロー';
          message = followMessage(performer.name);
          break;
      }

      const onPress = () => {
        if (_type === NotificationType.Reply) {
          if (!talkRoomType || !talkRoomId) {
            return;
          }

          if (talkRoomType === TalkRoomType.Thought) {
            const room = findThoughtTalkRoom({ id: talkRoomId });
            if (room) {
              navigation.navigate('ThoughtTalkRoom', {
                screen: 'ThoughtTalkRoomMain',
                params: {
                  id: room.id,
                },
              });
            }
            return;
          }

          if (talkRoomType === TalkRoomType.News) {
            const room = findNewsTalkRoom({ id: talkRoomId });
            if (room) {
              navigation.navigate('NewsTalkRoom', {
                screen: 'NewsTalkRoomMain',
                params: {
                  id: room.id,
                },
              });
            }
            return;
          }

          if (talkRoomType === TalkRoomType.Oneonone) {
            const room = findOneOnOneTalkRoom({ talkRoomId });
            if (room) {
              navigation.navigate('OneOnOneTalkRoom', {
                screen: 'OneOnOneTalkRoomMain',
                params: {
                  id: room.id,
                },
              });
            }
            return;
          }
        }

        if (_type === NotificationType.Like) {
          if (thought) {
            navigation.navigate('Thought', {
              id: thought.id,
            });
          }
          return;
        }

        if (_type === NotificationType.Follow) {
          navigation.navigate('UserProfile', {
            id: performer.id,
          });
          return;
        }
      };

      const onAvatarPress = () => {
        navigation.navigate('UserProfile', {
          id: performer.id,
        });
      };

      return (
        <Pressable
          px="4"
          py="4"
          _pressed={{
            bg: pressed,
          }}
          onPress={onPress}
        >
          <HStack>
            <Pressable onPress={onAvatarPress}>
              <UserImage size="10" uri={performer.imageUrl} />
            </Pressable>
            <Box ml="4" flexShrink="1">
              <Text fontWeight="bold">{message}</Text>
              <Text color={textGray}>{`${diff} ・ ${type}`}</Text>
            </Box>
          </HStack>
        </Pressable>
      );
    },
    [
      findNewsTalkRoom,
      findOneOnOneTalkRoom,
      findThoughtTalkRoom,
      navigation,
      pressed,
      textGray,
    ]
  );

  const infiniteLoad = async () => {
    if (notificationData?.notifications.pageInfo.hasNextPage) {
      const cursor = notificationData.notifications.pageInfo.endCursor;
      await fetchMore({
        variables: {
          after: cursor ? btoa(cursor) : undefined,
        },
      });
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!notificationData?.notifications) {
    return <Indicator style={styles.indicator} />;
  }

  return (
    <InfiniteFlatList<Item>
      data={notificationData.notifications.edges}
      renderItem={renderItem}
      keyExtractor={(item) => item.node.id.toString()}
      infiniteLoad={infiniteLoad}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    marginTop: 10,
  },
});

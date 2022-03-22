import React, { useLayoutEffect, useCallback } from 'react';
import {
  Box,
  HStack,
  Text,
  useColorModeValue,
  Pressable,
  FlatList,
} from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { UserImage } from 'src/components/UserImage';
import {
  useGetNotificationsQuery,
  NotificationEdge,
  NotificationType,
  TalkRoomType,
} from 'src/generated/graphql';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useFindThoughtTalkRoom } from 'src/hooks/thoughtTalkRoom';
import { useFindNewsTalkRoom } from 'src/hooks/newsTalkRoom';
import { useFindOneOnOneTalkRoom } from 'src/hooks/oneOnOneTalkRoom';

type Props = RootNavigationScreenProp<'Notifications'>;

type Item = NotificationEdge;

const replyMessage = (name: string) => `${name}から返信が届きました。`;

export const NotificationsScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'お知らせ',
    });
  }, [navigation]);

  const textGray = useColorModeValue('lt.textGray', 'dt.textGray');
  const pressed = useColorModeValue('lt.pressed', 'dt.pressed');

  const { data: notificationData } = useGetNotificationsQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-only',
  });

  const { findThoughtTalkRoom } = useFindThoughtTalkRoom();
  const { findNewsTalkRoom } = useFindNewsTalkRoom();
  const { findOneOnOneTalkRoom } = useFindOneOnOneTalkRoom();

  const renderItem = useCallback(({ item }: { item: Item }) => {
    const {
      performer,
      createdAt,
      type: _type,
      talkRoomType,
      talkRoomId,
    } = item.node;

    const diff = formatDistanceToNow(new Date(Number(createdAt)), {
      locale: ja,
      addSuffix: true,
    });

    let type: string = '';
    switch (_type) {
      case NotificationType.Reply:
        type = '返信';
        break;
      case NotificationType.Like:
        type = 'いいね';
        break;
      case NotificationType.Follow:
        type = 'フォロー';
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
        }
      }
    };

    return (
      <Pressable
        px="6"
        py="2"
        _pressed={{
          bg: pressed,
        }}
        onPress={onPress}
      >
        <HStack>
          <UserImage size="10" uri={performer.imageUrl} />
          <Box ml="4">
            <Text fontWeight="bold">{replyMessage(performer.name)}</Text>
            <Text color={textGray}>{`${diff} ・ ${type}`}</Text>
          </Box>
        </HStack>
      </Pressable>
    );
  }, []);

  if (!notificationData?.notifications) {
    // インジケータ出す
    return null;
  }

  return (
    <FlatList
      data={notificationData.notifications.edges}
      renderItem={renderItem}
      keyExtractor={(item) => item.node.id}
    />
  );
};

import React, { useCallback, useState } from 'react';
import { Box, FlatList } from 'native-base';
import {
  useGetThoughtTalkRoomsQuery,
  useGetOutThoughtTalkRoomMutation,
  GetThoughtTalkRoomsQueryResult,
  useDeleteThoughtTalkRoomMutation,
} from 'src/generated/graphql';
import { RootNavigationProp } from 'src/types';
import { useNavigation } from '@react-navigation/native';
import { InstaLikeModal } from 'src/components/InstaLikeModal';
import { Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Haptics from 'expo-haptics';
import { useDeleteThoughtTalkRoomsItemFromCache } from 'src/hooks/thoughtTalkRoom';
import { TalkRoomListItem } from 'src/components/TalkRoomListItem';
import { spinnerVisibleVar } from 'src/stores/spinner';
import { useMyId } from 'src/hooks/me';

type Item = GetThoughtTalkRoomsQueryResult['data']['thoughtTalkRooms'][number];

export const ThoughtTalkRoomList = React.memo(() => {
  const { data } = useGetThoughtTalkRoomsQuery();
  const [getOutMutation] = useGetOutThoughtTalkRoomMutation();
  const [deleteTalkRoomMutation] = useDeleteThoughtTalkRoomMutation();

  const myId = useMyId();

  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const toast = useToast();

  const [modalData, setModalData] = useState<{
    roomId: number;
    isMyThoughtData: boolean;
  } | null>(null);

  const closeModal = () => {
    setModalData(null);
  };

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const baseMenuList = [
    {
      title: 'トークから抜ける',
      color: 'red',
      onPress: () => {
        Alert.alert(
          'トークから抜ける',
          'このトークルームは表示されなくなります。トークから抜けてよろしいですか?',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: '抜ける',
              style: 'destructive',
              onPress: async () => {
                if (modalData) {
                  try {
                    await getOutMutation({
                      variables: {
                        input: {
                          roomId: modalData.roomId,
                        },
                      },
                      update: () => {
                        deleteThoghtTalkRoom({ talkRoomId: modalData.roomId });
                      },
                    });

                    toast.show('削除しました', { type: 'success' });
                  } catch (e) {
                  } finally {
                    setModalData(null);
                  }
                }
              },
            },
          ]
        );
      },
    },
  ];

  const meMenuList = [
    {
      title: 'トークルームを解散',
      color: 'red',
      onPress: () => {
        Alert.alert(
          'トークルームを解散',
          '全てのメンバー、メッセージが削除されます。解散してよろしいですか?',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: '解散',
              style: 'destructive',
              onPress: async () => {
                if (modalData) {
                  spinnerVisibleVar(true);
                  try {
                    await deleteTalkRoomMutation({
                      variables: {
                        input: {
                          talkRoomId: modalData.roomId,
                        },
                      },
                      update: () => {
                        deleteThoghtTalkRoom({ talkRoomId: modalData.roomId });
                        toast.show('解散しました', { type: 'success' });
                      },
                    });
                  } catch (e) {
                    console.log(e);
                  } finally {
                    setModalData(null);
                    spinnerVisibleVar(false);
                  }
                }
              },
            },
          ]
        );
      },
    },
    ...baseMenuList,
  ];

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      let userImageUrls: string[] = [];

      const { edges } = item.messages;

      for (let i = 0; i <= 7; i++) {
        const member = item.members.edges[i];
        if (member) {
          userImageUrls.push(member.node.user.imageUrl);
        }
      }

      const title = item.thought.title ? item.thought.title : item.thought.text;
      const text = edges.length ? edges[0].node.text : '';
      const allMessageSeen = item.allMessageSeen;

      const isMyThoughtData = item.thought.contributor.id === myId;

      const onPress = () => {
        navigation.navigate('ThoughtTalkRoom', {
          screen: 'ThoughtTalkRoomMain',
          params: {
            id: item.id,
          },
        });
      };

      const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setModalData({ roomId: item.id, isMyThoughtData });
      };

      return (
        <TalkRoomListItem
          title={title}
          text={text}
          allMessageSeen={allMessageSeen}
          onPress={onPress}
          onLongPress={onLongPress}
          userImageUrls={userImageUrls}
        />
      );
    },
    [myId, navigation]
  );

  if (!data) {
    return <></>;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.thoughtTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {!!modalData && (
        <InstaLikeModal
          isVisible={!!modalData}
          list={modalData.isMyThoughtData ? meMenuList : baseMenuList}
          onBackdropPress={closeModal}
          onCancel={closeModal}
        />
      )}
    </Box>
  );
});

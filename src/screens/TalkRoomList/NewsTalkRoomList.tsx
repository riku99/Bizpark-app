import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Box } from 'native-base';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { InstaLikeModal, ListItem } from 'src/components/InstaLikeModal';
import { TalkRoomListItem } from 'src/components/TalkRoomListItem';
import {
  GetNewsTalkRoomsQueryResult,
  useGetNewsTalkRoomsQuery,
  useGetOutNewsTalkRoomMutation,
} from 'src/generated/graphql';
import { useDeleteNewsTalkRoomFromCache } from 'src/hooks/newsTalkRoom';
import { RootNavigationProp } from 'src/types';

type Item = GetNewsTalkRoomsQueryResult['data']['newsTalkRooms'][number];

export const NewsTalkRoomList = React.memo(() => {
  const { data: talkRoomData } = useGetNewsTalkRoomsQuery();

  const navigation = useNavigation<RootNavigationProp<'Tab'>>();

  const [getOutTalkRoomMutation] = useGetOutNewsTalkRoomMutation();

  const [modalData, setModalData] = useState<{ roomId: number } | null>(null);

  const toast = useToast();

  const { deleteNewsTalkRoom } = useDeleteNewsTalkRoomFromCache();

  const closeModal = () => {
    setModalData(null);
  };

  const modalList: ListItem[] = [
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
                    await getOutTalkRoomMutation({
                      variables: {
                        input: {
                          talkRoomId: modalData.roomId,
                        },
                      },
                      update: () => {
                        // キャッシュからトークルーム削除
                        deleteNewsTalkRoom({ talkRoomId: modalData.roomId });
                      },
                    });

                    toast.show('削除しました', { type: 'success' });
                  } catch (e) {
                    console.log(e);
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

  const renderItem = useCallback(({ item }: { item: Item }) => {
    let userImageUrls: string[] = [];

    const { edges } = item.messages;

    for (let i = 0; i <= 7; i++) {
      const member = item.members.edges[i];
      if (member) {
        userImageUrls.push(member.node.user.imageUrl);
      }
    }

    const title = item.news.title;
    const text = edges.length ? edges[0].node.text : '';
    const allMessageSeen = item.allMessageSeen;

    const onPress = () => {
      navigation.navigate('NewsTalkRoom', {
        screen: 'NewsTalkRoomMain',
        params: {
          id: item.id,
        },
      });
    };

    const onLongPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setModalData({ roomId: item.id });
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
  }, []);

  if (!talkRoomData) {
    return null;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={talkRoomData.newsTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <InstaLikeModal
        isVisible={!!modalData}
        list={modalList}
        onBackdropPress={closeModal}
        onCancel={closeModal}
      />
    </Box>
  );
});

import { useNavigation } from '@react-navigation/native';
import { Box, Button } from 'native-base';
import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { CloseButton } from 'src/components/CloseButton';
import {
  GetNewsTalkRoomsDocument,
  GetNewsTalkRoomsQuery,
  NewsTalkRoomJoinError,
  useJoinNewsTalkRoomMutation,
} from 'src/generated/graphql';
import { useFindNewsTalkRoomFromNewsId } from 'src/hooks/newsTalkRoom';
import { spinnerVisibleVar } from 'src/stores/spinner';
import { RootNavigationProp } from 'src/types';
import { getGraphQLError } from 'src/utils';

type Props = {
  onCloseButtonPress: () => void;
  newsId: number;
};

export const JoinTalkButton = ({ onCloseButtonPress, newsId }: Props) => {
  const navigation = useNavigation<RootNavigationProp<'NewsWebView'>>();

  const [joinNewsTalkRoomMutation] = useJoinNewsTalkRoomMutation();

  const { findNewsTalkRoom } = useFindNewsTalkRoomFromNewsId();

  const toast = useToast();

  const onJoinPress = async () => {
    let talkRoomId: number | null = null;

    const existingTalkRoom = findNewsTalkRoom({ newsId });

    if (existingTalkRoom) {
      talkRoomId = existingTalkRoom.id;
    } else {
      try {
        spinnerVisibleVar(true);
        await joinNewsTalkRoomMutation({
          variables: {
            input: {
              newsId,
            },
          },
          update: (cache, { data: responseData }) => {
            const queryData = cache.readQuery<GetNewsTalkRoomsQuery>({
              query: GetNewsTalkRoomsDocument,
            });

            if (queryData) {
              cache.writeQuery({
                query: GetNewsTalkRoomsDocument,
                data: {
                  newsTalkRooms: [
                    responseData.joinNewsTalkRoom,
                    ...queryData.newsTalkRooms,
                  ],
                },
              });

              talkRoomId = responseData.joinNewsTalkRoom.id;
            }
          },
        });
      } catch (errors) {
        const gqlError = getGraphQLError(errors, 0);
        if (gqlError) {
          if (gqlError.code === NewsTalkRoomJoinError.UserRemoved) {
            Alert.alert('現在このトークルームに参加することができません');
            return;
          }

          if (gqlError.code === NewsTalkRoomJoinError.UpperLimit) {
            Alert.alert(
              '参加できるトーク数が上限に達しています',
              '無料プランのユーザーが参加できるトーク数は月に6つまでです。プランをアップグレードすることで無制限に参加できるようになります！',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.navigate('IAP');
                  },
                },
              ]
            );
            return;
          }
        }
      } finally {
        spinnerVisibleVar(false);
      }
    }

    if (talkRoomId) {
      navigation.navigate('NewsTalkRoom', {
        screen: 'NewsTalkRoomMain',
        params: {
          id: talkRoomId,
        },
      });
    }
  };

  return (
    <Box
      position="absolute"
      w="96%"
      alignItems="center"
      alignSelf="center"
      bottom={4}
    >
      <CloseButton
        size={7}
        style={styles.closeButton}
        onPress={onCloseButtonPress}
      />
      <Button
        w="100%"
        _text={{ fontSize: 18 }}
        onPress={onJoinPress}
        borderRadius="lg"
        h="12"
      >
        このニュースについてトークする
      </Button>
    </Box>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-end',
    transform: [{ translateY: -15 }],
  },
});

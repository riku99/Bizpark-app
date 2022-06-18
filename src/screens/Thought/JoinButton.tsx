import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import {
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
  ThouhgtTalkRoomJoinError,
  useJoinThoughtTalkMutation,
} from 'src/generated/graphql';
import { useFindThoughtTalkRoomsByThoughtId } from 'src/hooks/thoughtTalkRoom';
import { spinnerVisibleVar } from 'src/stores/spinner';
import { RootNavigationProp } from 'src/types';
import { getGraphQLError } from 'src/utils';

type Props = { thoughtId: string; contributorId: string };

export const JoinButton = ({ thoughtId, contributorId }: Props) => {
  const [joinMutation] = useJoinThoughtTalkMutation();
  const navigation = useNavigation<RootNavigationProp<'Thought'>>();
  const existingData = useFindThoughtTalkRoomsByThoughtId({ thoughtId });

  const toast = useToast();

  const onPress = async () => {
    let roomId: number | null = null;

    // 既にローカルでデータ持ってるか確認
    if (existingData) {
      roomId = existingData.id;
    } else {
      // ない場合サーバーにリクエスト
      try {
        spinnerVisibleVar(true);
        const { data } = await joinMutation({
          variables: {
            input: {
              thoughtId,
              contributorId,
            },
          },
          update: (cache, { data: responseData }) => {
            const queryData = cache.readQuery<GetThoughtTalkRoomsQuery>({
              query: GetThoughtTalkRoomsDocument,
            });

            if (queryData) {
              cache.writeQuery({
                query: GetThoughtTalkRoomsDocument,
                data: {
                  thoughtTalkRooms: [
                    responseData.joinThoughtTalk,
                    ...queryData.thoughtTalkRooms,
                  ],
                },
              });
            }
          },
        });

        if (data) {
          roomId = data.joinThoughtTalk.id;
        }
      } catch (errors) {
        const error = getGraphQLError(errors, 0);
        if (error) {
          if (error.code === ThouhgtTalkRoomJoinError.Blokced) {
            Alert.alert('現在このトークに参加することができません');
            return;
          }

          if (error.code === ThouhgtTalkRoomJoinError.UpperLimit) {
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

    if (roomId) {
      navigation.navigate('ThoughtTalkRoom', {
        screen: 'ThoughtTalkRoomMain',
        params: {
          id: roomId,
        },
      });
    }
  };

  return (
    <Button _text={{ fontSize: 16 }} onPress={onPress}>
      トークに参加する 🚀
    </Button>
  );
};

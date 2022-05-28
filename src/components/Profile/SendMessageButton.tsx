import { useNavigation } from '@react-navigation/native';
import { Pressable, Text, useColorModeValue } from 'native-base';
import React, { ComponentProps } from 'react';
import { Alert } from 'react-native';
import {
  GetOneOnOneTalkRoomsDocument,
  GetOneOnOneTalkRoomsQuery,
  OneOnOneTalkRoomCreationError,
  useCreateOneOnOneTalkRoomMutation,
} from 'src/generated/graphql';
import { useIsPlusPlan } from 'src/hooks/me';
import { useFindOneOnOneTalkRoomFromUserId } from 'src/hooks/oneOnOneTalkRoom';
import { spinnerVisibleVar } from 'src/stores/spinner';
import { RootNavigationProp } from 'src/types';
import { getGraphQLError } from 'src/utils';

type Props = {
  user: {
    id?: string;
    name?: string;
  };
} & ComponentProps<typeof Pressable>;

export const SendMessageButton = ({ user, ...props }: Props) => {
  const borderColor = useColorModeValue('textBlack', 'textWhite');
  const [createTalkRoomMutation] = useCreateOneOnOneTalkRoomMutation();
  const { findOneOnOneTalkRoom } = useFindOneOnOneTalkRoomFromUserId();
  const navigation = useNavigation<RootNavigationProp<'UserProfile'>>();
  const isPlusPlan = useIsPlusPlan();

  const onPress = async () => {
    if (!isPlusPlan) {
      navigation.navigate('IAP');
      return;
    }

    let talkRoomId: number | null = null;

    const existingTalkRoom = findOneOnOneTalkRoom({ userId: user.id });

    if (existingTalkRoom) {
      talkRoomId = existingTalkRoom.id;
    } else {
      try {
        spinnerVisibleVar(true);

        await createTalkRoomMutation({
          variables: {
            input: {
              recipientId: user.id,
            },
          },
          update: (cache, { data: responseData }) => {
            const queryResult = cache.readQuery<GetOneOnOneTalkRoomsQuery>({
              query: GetOneOnOneTalkRoomsDocument,
            });

            if (queryResult) {
              const newTalkRooms = [
                responseData.createOneOnOneTalkRoom,
                ...queryResult.oneOnOneTalkRooms,
              ];

              cache.writeQuery({
                query: GetOneOnOneTalkRoomsDocument,
                data: {
                  oneOnOneTalkRooms: newTalkRooms,
                },
              });

              talkRoomId = responseData.createOneOnOneTalkRoom.id;
            }
          },
        });
      } catch (e) {
        console.log(e);
        const gqlError = getGraphQLError(e, 0);
        if (gqlError) {
          if (
            gqlError.code === OneOnOneTalkRoomCreationError.BlockingOrBlocked
          ) {
            Alert.alert('トークルームを作成できませんでした');
          } else if (
            gqlError.code === OneOnOneTalkRoomCreationError.Rejection
          ) {
            Alert.alert('相手がメッセージの受け取りを許可していません');
          } else if (
            gqlError.code === OneOnOneTalkRoomCreationError.UserNotFound
          ) {
            Alert.alert('ユーザーが存在しません');
          }
        }
      } finally {
        spinnerVisibleVar(false);
      }
    }

    if (talkRoomId) {
      navigation.navigate('OneOnOneTalkRoom', {
        screen: 'OneOnOneTalkRoomMain',
        params: {
          id: talkRoomId,
          user: {
            name: user.name,
          },
        },
      });
    }
  };

  return (
    <Pressable
      px="2"
      py="1"
      borderRadius="2xl"
      borderWidth="1"
      borderColor={borderColor}
      onPress={onPress}
      {...props}
    >
      <Text fontWeight="bold" fontSize="13">
        メッセージを送る
      </Text>
    </Pressable>
  );
};

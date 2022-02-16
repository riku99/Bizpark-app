import React, { useLayoutEffect } from 'react';
import { RootNavigationScreenProp } from 'src/types';
import { HeaderBackButton } from '@react-navigation/elements';
import {
  useGetOneOnOneTalkRoomMessagesQuery,
  useCreateOneOnOneTalkRoomMessageMutation,
  useSeenOneOnOneTalkRoomMessageMutation,
  useMeQuery,
  useGetOneOnOneTalkRoomQuery,
} from 'src/generated/graphql';
import { TalkRoomMessage } from 'src/components/TalkRoomMessage';
import { useDeleteOneOnOneTalkRoomFromCache } from 'src/hooks/oneOnOneTalkRoom';
import { useReactiveVar } from '@apollo/client';
import { meVar } from 'src/stores/me';

type Props = RootNavigationScreenProp<'OneOnOneTalkRoomMain'>;

export const OneOnOneTalkRoomScreen = ({ navigation, route }: Props) => {
  const talkRoomId = route.params.id;

  const myId = useReactiveVar(meVar.id);

  const { data: talkRoomData, loading } = useGetOneOnOneTalkRoomQuery({
    variables: {
      id: talkRoomId,
    },
  });

  const { data: messageData, fetchMore } = useGetOneOnOneTalkRoomMessagesQuery({
    variables: {
      id: talkRoomId,
    },
  });

  const [createMessageMutation] = useCreateOneOnOneTalkRoomMessageMutation();

  const [seenMutation] = useSeenOneOnOneTalkRoomMessageMutation();

  const { deleteOneOnOneTalkRoomFromCache } =
    useDeleteOneOnOneTalkRoomFromCache();

  useLayoutEffect(() => {
    let headerTitle: string = '';

    if (talkRoomData) {
      const { recipient, sender } = talkRoomData.oneOnOneTalkRoom;
      headerTitle = myId === sender.id ? recipient.name : sender.name;
    } else {
      if (!loading) {
        headerTitle = 'メンバーが存在しません';
      }
    }

    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerTitle,
    });
  }, [navigation, myId, talkRoomData]);

  if (!messageData || !talkRoomData) {
    return null;
  }

  return (
    <TalkRoomMessage
      type="OneOnOne"
      roomId={talkRoomId}
      messageData={messageData}
      messageFetchMore={fetchMore}
      createMessage={createMessageMutation}
      createSeen={seenMutation}
      deleteTalkRoomFromCache={deleteOneOnOneTalkRoomFromCache}
    />
  );
};

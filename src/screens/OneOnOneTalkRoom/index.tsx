import React, { useLayoutEffect } from 'react';
import { RootNavigationScreenProp } from 'src/types';
import { HeaderBackButton } from '@react-navigation/elements';
import {
  useGetOneOnOneTalkRoomMessagesQuery,
  useCreateOneOnOneTalkRoomMessageMutation,
  useSeenOneOnOneTalkRoomMessageMutation,
  useGetOneOnOneTalkRoomQuery,
} from 'src/generated/graphql';
import { TalkRoomMessage } from 'src/components/TalkRoomMessage';
import { useDeleteOneOnOneTalkRoomFromCache } from 'src/hooks/oneOnOneTalkRoom';
import { Indicator } from 'src/components/Indicator';
import { useIsMe } from 'src/hooks/me';

type Props = RootNavigationScreenProp<'OneOnOneTalkRoomMain'>;

export const OneOnOneTalkRoomScreen = ({ navigation, route }: Props) => {
  const talkRoomId = route.params.id;

  const { isMe } = useIsMe();

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
      headerTitle = isMe({ userId: sender.id }) ? recipient.name : sender.name;
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
  }, [navigation, isMe, talkRoomData]);

  if (!messageData || !talkRoomData) {
    return <Indicator />;
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

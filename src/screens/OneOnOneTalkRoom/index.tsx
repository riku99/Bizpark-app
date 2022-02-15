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

type Props = RootNavigationScreenProp<'OneOnOneTalkRoomMain'>;

export const OneOnOneTalkRoomScreen = ({ navigation, route }: Props) => {
  const talkRoomId = route.params.id;

  const {
    data: { me },
  } = useMeQuery({
    fetchPolicy: 'cache-only',
  });

  // const { data: talkRoomData, loading } = useGetOneOnOneTalkRoomQuery({
  //   variables: {
  //     id: talkRoomId,
  //   },
  // });

  const { data: messageData, fetchMore } = useGetOneOnOneTalkRoomMessagesQuery({
    variables: {
      id: talkRoomId,
    },
  });

  console.log(messageData?.oneOnOneTalkRoom.messages.edges.length);

  const [createMessageMutation] = useCreateOneOnOneTalkRoomMessageMutation();

  const [seenMutation] = useSeenOneOnOneTalkRoomMessageMutation();

  const { deleteOneOnOneTalkRoomFromCache } =
    useDeleteOneOnOneTalkRoomFromCache();

  const talkRoomData = true;

  useLayoutEffect(() => {
    let headerTitle: string = '';

    // if (talkRoomData) {
    //   const { recipient, sender } = talkRoomData.oneOnOneTalkRoom;
    //   headerTitle = me.id === sender.id ? recipient.name : sender.name;
    // } else {
    //   if (!loading) {
    //     headerTitle = 'メンバーが存在しません';
    //   }
    // }

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
  }, [navigation, me, talkRoomData]);

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

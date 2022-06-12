import { HeaderBackButton } from '@react-navigation/elements';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { DotsHorizontal } from 'src/components/DotsHorizontal';
import { Indicator } from 'src/components/Indicator';
import { TalkRoomMessage } from 'src/components/TalkRoomMessage';
import { TalkRoomUserImagesHeader } from 'src/components/TalkRoomUserImagseHeader';
import {
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
  useGetThoughtTalkRoomMembersQuery,
  useGetThoughtTalkRoomMessagesQuery,
  useGetThoughtTalkRoomParentInThoughtTalkRoomScreenQuery,
  useGetThoughtTalkRoomsQuery,
} from 'src/generated/graphql';
import { useDeleteThoughtTalkRoomsItemFromCache } from 'src/hooks/thoughtTalkRoom';
import { RootNavigationScreenProp } from 'src/types';
import { Menu } from './Menu';

type Props = RootNavigationScreenProp<'ThoughtTalkRoomMain'>;

export const ThoughtTalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const { data: messageData, fetchMore } = useGetThoughtTalkRoomMessagesQuery({
    variables: {
      id,
    },
  });

  const { data: membersData } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId: id,
    },
  });

  const { data: talkRoomsData } = useGetThoughtTalkRoomsQuery();

  const memberImageUrls = useMemo(() => {
    return membersData?.thoughtTalkRoom.members.edges
      .slice(0, 7)
      .map((edge) => edge.node.user.imageUrl);
  }, [membersData]);

  const [createMessageMutation] = useCreateThoughtTalkRoomMessageMutation();

  const [createSeenMutation] =
    useCreateUserThoughtTalkRoomMessageSeenMutation();

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const renderHeaderTitle = useCallback(() => {
    return (
      <TalkRoomUserImagesHeader
        imageUrls={memberImageUrls}
        onPress={() => {
          navigation.navigate('ThoughtTalkRoomMembers', {
            talkRoomId: id,
          });
        }}
      />
    );
  }, [memberImageUrls, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerRight: () => (
        <DotsHorizontal onPress={() => setModalVisible(true)} />
      ),
    });
  }, [navigation, renderHeaderTitle]);

  const { data: thoughtData } =
    useGetThoughtTalkRoomParentInThoughtTalkRoomScreenQuery({
      variables: {
        id,
      },
    });

  if (!messageData || !thoughtData) {
    return <Indicator />;
  }

  return (
    <>
      <TalkRoomMessage
        type="Thought"
        roomId={id}
        messageData={messageData}
        messageFetchMore={fetchMore}
        createMessage={createMessageMutation}
        createSeen={createSeenMutation}
        deleteTalkRoomFromCache={deleteThoghtTalkRoom}
        talkRoomsData={talkRoomsData}
      />

      <Menu
        isVisible={modalVisible}
        closeMenu={() => {
          setModalVisible(false);
        }}
        talkRoomId={id}
        thoughtId={thoughtData.thoughtTalkRoom.thought.id}
      />
    </>
  );
};

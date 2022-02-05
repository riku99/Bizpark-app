import React, { useMemo, useState, useLayoutEffect, useCallback } from "react";
import { TalkRoom } from "src/components/TalkRoom";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomMessagesQuery,
  useGetThoughtTalkRoomMembersQuery,
  useGetThoughtTalkRoomParentQuery,
  useMeQuery,
  useCreateThoughtTalkRoomMessageMutation,
  useCreateUserThoughtTalkRoomMessageSeenMutation,
} from "src/generated/graphql";
import { Menu } from "./Menu";
import { DotsHorizontal } from "src/components/DotsHorizontal";
import { HeaderBackButton } from "@react-navigation/elements";
import { TalkRoomUserImagesHeader } from "src/components/TalkRoomUserImagseHeader";
import { useDeleteThoughtTalkRoomsItemFromCache } from "src/hooks/thoughtTalkRoom";

type Props = RootNavigationScreenProp<"ThoughtTalkRoomMain">;

export const ThoughtTalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: { me },
  } = useMeQuery();

  const { data: messageData, fetchMore } = useGetThoughtTalkRoomMessagesQuery({
    variables: {
      id,
    },
    fetchPolicy: "cache-only",
  });

  const { data: membersData } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId: id,
    },
  });

  const [createMessageMutation] = useCreateThoughtTalkRoomMessageMutation();

  const [
    createSeenMutation,
  ] = useCreateUserThoughtTalkRoomMessageSeenMutation();

  const { deleteThoghtTalkRoom } = useDeleteThoughtTalkRoomsItemFromCache();

  const renderHeaderTitle = useCallback(() => {
    return (
      <TalkRoomUserImagesHeader
        members={membersData?.thoughtTalkRoom.members}
        onPress={() => {
          navigation.navigate("ThoughtTalkRoomMembers", {
            talkRoomId: id,
          });
        }}
      />
    );
  }, [membersData, navigation]);

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

  const { data: thoughtData } = useGetThoughtTalkRoomParentQuery({
    variables: {
      id,
    },
  });

  const isMyThuoghtTalkRoomData = useMemo(() => {
    if (!thoughtData || !me) {
      return false;
    }

    return thoughtData.thoughtTalkRoom.thought.contributor.id === me.id;
  }, [thoughtData, me]);

  return (
    <>
      <TalkRoom
        type="Thought"
        roomId={id}
        messageData={messageData}
        messageFetchMore={fetchMore}
        createMessage={createMessageMutation}
        createSeen={createSeenMutation}
        deleteTalkRoomFromCache={deleteThoghtTalkRoom}
      />

      <Menu
        isVisible={modalVisible}
        closeMenu={() => {
          setModalVisible(false);
        }}
        talkRoomId={id}
        isMyThuoghtTalkRoomData={isMyThuoghtTalkRoomData}
      />
    </>
  );
};

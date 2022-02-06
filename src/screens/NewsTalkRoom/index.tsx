import React, { useLayoutEffect, useMemo, useCallback, useEffect } from "react";
import { HeaderBackButton } from "@react-navigation/elements";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetNewsTalkRoomMessagesQuery,
  useMeQuery,
  useCreateNewsTalkRoomMessageMutation,
  useCreateUserNewsTalkRoomMessageSeenMutation,
  useGetNewsTalkRoomMembersQuery,
} from "src/generated/graphql";
import { TalkRoomMessage } from "src/components/TalkRoomMessage";
import { useDeleteNewsTalkRoomFromCache } from "src/hooks/newsTalkRoom";
import { TalkRoomUserImagesHeader } from "src/components/TalkRoomUserImagseHeader";

type Props = RootNavigationScreenProp<"NewsTalkRoomMain">;

export const NewsTalkRoomScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const {
    data: { me },
  } = useMeQuery();

  const { data: messageData, fetchMore } = useGetNewsTalkRoomMessagesQuery({
    variables: {
      talkRoomId: id,
    },
    fetchPolicy: "cache-only",
  });

  const { data: membersData } = useGetNewsTalkRoomMembersQuery({
    variables: {
      talkRoomId: id,
    },
  });

  const memberImageUrls = useMemo(() => {
    return membersData?.newsTalkRoom.members.edges
      .slice(0, 7)
      .map((edge) => edge.node.user.imageUrl);
  }, [membersData]);

  const renderHeaderTitle = useCallback(() => {
    return (
      <TalkRoomUserImagesHeader
        imageUrls={memberImageUrls}
        onPress={() => {
          navigation.navigate("NewsTalkRoomMembers", {
            talkRoomId: id,
          });
        }}
      />
    );
  }, [memberImageUrls]);

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
    });
  }, [navigation, renderHeaderTitle]);

  const [createMessageMutation] = useCreateNewsTalkRoomMessageMutation();

  const [createSeenMutation] = useCreateUserNewsTalkRoomMessageSeenMutation();

  const { deleteNewsTalkRoom } = useDeleteNewsTalkRoomFromCache();

  return (
    <>
      <TalkRoomMessage
        type="News"
        roomId={id}
        messageData={messageData}
        messageFetchMore={fetchMore}
        createMessage={createMessageMutation}
        createSeen={createSeenMutation}
        deleteTalkRoomFromCache={deleteNewsTalkRoom}
      />
    </>
  );
};

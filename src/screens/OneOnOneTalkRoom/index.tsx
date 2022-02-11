import React, { useLayoutEffect } from "react";
import { RootNavigationScreenProp } from "src/types";
import { HeaderBackButton } from "@react-navigation/elements";
import {
  useGetOneOnOneTalkRoomMessagesQuery,
  useCreateOneOnOneTalkRoomMessageMutation,
  useSeenOneOnOneTalkRoomMessageMutation,
} from "src/generated/graphql";
import { TalkRoomMessage } from "src/components/TalkRoomMessage";
import { useDeleteOneOnOneTalkRoomFromCache } from "src/hooks/oneOnOneTalkRoom";

type Props = RootNavigationScreenProp<"OneOnOneTalkRoomMain">;

export const OneOnOneTalkRoomScreen = ({ navigation, route }: Props) => {
  const talkRoomId = route.params.id;
  const { user } = route.params;

  const { data: messageData, fetchMore } = useGetOneOnOneTalkRoomMessagesQuery({
    variables: {
      id: talkRoomId,
    },
    fetchPolicy: "cache-only",
  });

  const [createMessageMutation] = useCreateOneOnOneTalkRoomMessageMutation();

  const [seenMutation] = useSeenOneOnOneTalkRoomMessageMutation();

  const {
    deleteOneOnOneTalkRoomFromCache,
  } = useDeleteOneOnOneTalkRoomFromCache();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
      headerTitle: user.name,
    });
  }, [navigation]);

  if (!messageData) {
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

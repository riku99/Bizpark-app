import React, { useLayoutEffect, useCallback } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetNewsTalkRoomMembersQuery,
  NewsTalkRoomMemberEdge,
} from "src/generated/graphql";
import { MemberListItem } from "src/components/TalkRoomMemberListItem";

type Props = RootNavigationScreenProp<"NewsTalkRoomMembers">;

type Item = NewsTalkRoomMemberEdge;

export const NewsTalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
    });
  }, [navigation]);

  const { data: membersData, fetchMore } = useGetNewsTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: "network-only",
  });

  const renderItem = useCallback(({ item }: { item: Item }) => {
    return <MemberListItem item={item} talkRoomId={talkRoomId} />;
  }, []);

  return <Box></Box>;
};

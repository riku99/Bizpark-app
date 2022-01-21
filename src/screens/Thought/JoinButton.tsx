import React from "react";
import { Button } from "native-base";
import {
  useJoinThoughtTalkMutation,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
} from "src/generated/graphql";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { useFindThoughtTalkRoomsByThoughtId } from "src/hooks/thoughtTalkRoom";

type Props = { thoughtId: string; contributorId: string };

export const JoinButton = ({ thoughtId, contributorId }: Props) => {
  const [joinMutation] = useJoinThoughtTalkMutation();
  const navigation = useNavigation<RootNavigationProp<"Thought">>();
  const existingData = useFindThoughtTalkRoomsByThoughtId({ thoughtId });

  const onPress = async () => {
    let roomId: string | null = null;
    // まず既にローカルでデータ持ってるか確認

    if (existingData) {
      console.log(existingData);
      roomId = existingData.id;
    } else {
      // ない場合サーバーにリクエスト
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
    }

    if (roomId) {
      navigation.navigate("TalkRoom", {
        id: roomId,
      });
    }
  };

  return (
    <Button _text={{ fontSize: 16 }} onPress={onPress}>
      トークに参加する 🚀
    </Button>
  );
};

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
import { spinnerVisibleVar } from "src/stores/spinner";

type Props = { thoughtId: string; contributorId: string };

export const JoinButton = ({ thoughtId, contributorId }: Props) => {
  const [joinMutation] = useJoinThoughtTalkMutation();
  const navigation = useNavigation<RootNavigationProp<"Thought">>();
  const existingData = useFindThoughtTalkRoomsByThoughtId({ thoughtId });

  const onPress = async () => {
    let roomId: number | null = null;

    // 既にローカルでデータ持ってるか確認
    if (existingData) {
      roomId = existingData.id;
    } else {
      // ない場合サーバーにリクエスト
      try {
        spinnerVisibleVar(true);
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
      } catch (e) {
        console.log(e);
      } finally {
        spinnerVisibleVar(false);
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

import React from "react";
import { Button } from "native-base";
import {
  useJoinThoughtTalkMutation,
  GetThoughtTalkRoomsDocument,
  GetThoughtTalkRoomsQuery,
} from "src/generated/graphql";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { useApolloClient } from "@apollo/client";

type Props = { thoughtId: string; contributorId: string };

export const JoinButton = ({ thoughtId, contributorId }: Props) => {
  const [joinMutation] = useJoinThoughtTalkMutation();
  const navigation = useNavigation<RootNavigationProp<"Thought">>();

  const onPress = async () => {
    // まず既にローカルでデータ持ってるか確認

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

    // 取得したidでルームに移動(メッセージを送っていなくても追加する。リロードしたらメッセージを送っていないルームは取得できないようにする)
    if (data) {
      navigation.navigate("TalkRoom", {
        id: data.joinThoughtTalk.id,
      });
    }
  };

  return (
    <Button _text={{ fontSize: 16 }} onPress={onPress}>
      トークに参加する 🚀
    </Button>
  );
};

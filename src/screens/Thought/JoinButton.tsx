import React from "react";
import { Button } from "native-base";
import { useJoinThoughtTalkMutation } from "src/generated/graphql";

type Props = { thoughtId: string; contributorId: string };

export const JoinButton = ({ thoughtId, contributorId }: Props) => {
  const [joinMutation] = useJoinThoughtTalkMutation();

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
    });
  };

  // 取得したデータをリストに追加(メッセージを送っていなくても追加する。リロードしたらメッセージを送っていないルームは取得できないようにする)

  return (
    <Button _text={{ fontSize: 16 }} onPress={onPress}>
      トークに参加する 🚀
    </Button>
  );
};

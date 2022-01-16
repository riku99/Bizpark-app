import React from "react";
import { Button } from "native-base";
import { useJoinThoughtTalkMutation } from "src/generated/graphql";

type Props = { thoughtId: string };

export const JoinButton = ({ thoughtId }: Props) => {
  const [joinMutation] = useJoinThoughtTalkMutation();

  const onPress = async () => {
    const { data } = await joinMutation({
      variables: {
        input: {
          thoughtId,
        },
      },
    });

    console.log(data);
  };

  return (
    <Button _text={{ fontSize: 16 }} onPress={onPress}>
      トークに参加する 🚀
    </Button>
  );
};

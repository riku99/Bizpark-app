import React from "react";
import { Pressable } from "native-base";
import { UserImages, TRANSLATE_IMAGE_X } from "src/components/UserImages";
import { GetThoughtTalkRoomQuery } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";

type Props = {
  talkRoomData?: GetThoughtTalkRoomQuery;
  onPress: () => void;
};

export const HeaderTitle = ({ talkRoomData, onPress }: Props) => {
  if (!talkRoomData) {
    return <Indicator />;
  }

  const urls = talkRoomData.thoughtTalkRoom.members.edges
    .slice(0, 7)
    .map((edge) => edge.node.user.imageUrl);

  return (
    <Pressable onPress={onPress}>
      <UserImages
        data={urls}
        imageSize="6"
        style={{
          transform: [
            { translateX: (urls.length - 1) * (TRANSLATE_IMAGE_X / 2) },
          ],
        }}
      />
    </Pressable>
  );
};

import React from "react";
import { Pressable } from "native-base";
import { UserImages, TRANSLATE_IMAGE_X } from "src/components/UserImages";
import { Indicator } from "src/components/Indicator";

type Props = {
  imageUrls?: string[];
  onPress: () => void;
};

export const TalkRoomUserImagesHeader = ({ imageUrls, onPress }: Props) => {
  if (!imageUrls) {
    return <Indicator />;
  }

  return (
    <Pressable onPress={onPress}>
      <UserImages
        data={imageUrls}
        imageSize="6"
        style={{
          transform: [
            { translateX: (imageUrls.length - 1) * (TRANSLATE_IMAGE_X / 2) },
          ],
        }}
      />
    </Pressable>
  );
};

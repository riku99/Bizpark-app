import React from "react";
import { Image } from "src/components/Image";
import { Image as NBImage } from "native-base";

const User = require("src/assets/image/user.png");

type Props = {
  uri?: string | null;
  size: number;
};

export const UserImage = ({ uri, size }: Props) => {
  return (
    <>
      {!!uri ? (
        <Image source={{ uri }} size={size} borderRadius="full" />
      ) : (
        <NBImage
          bg="#808080"
          borderRadius="full"
          source={User}
          size={size}
          alt="alt"
        />
      )}
    </>
  );
};

import React from "react";
import { Image } from "src/components/Image";
import { Image as NBImage } from "native-base";

const User = require("src/assets/image/user.png");

type Props = {
  uri?: string | null;
  size: number | string;
};

export const UserImage = ({ uri, size }: Props) => {
  return (
    <>
      {!!uri ? (
        <Image source={{ uri }} size={size} borderRadius="full" />
      ) : (
        <NBImage
          bg="#e0e0e0"
          borderRadius="full"
          source={User}
          size={size}
          alt="alt"
        />
      )}
    </>
  );
};

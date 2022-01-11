import React, { ComponentProps } from "react";
import { Image } from "src/components/Image";

const noUserImageUrl = "https://storage.googleapis.com/bizpark-dev/no-user.png";

type Props = {
  uri?: string | null;
} & Omit<ComponentProps<typeof Image>, "source">;

export const UserImage = ({ uri, size, ...props }: Props) => {
  return (
    <Image
      source={{
        uri: uri ?? noUserImageUrl,
      }}
      size={size}
      borderRadius="full"
      {...props}
    />
  );
};

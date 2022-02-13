import React, { ComponentProps } from 'react';
import { Image } from 'src/components/Image';
import { NO_USER_IMAGE_URL } from 'src/constants';

type Props = {
  uri?: string | null;
} & Omit<ComponentProps<typeof Image>, 'source'>;

export const UserImage = ({ uri, size, ...props }: Props) => {
  return (
    <Image
      source={{
        uri: uri ?? NO_USER_IMAGE_URL,
      }}
      size={size}
      borderRadius="full"
      {...props}
    />
  );
};

import React, { ComponentProps } from "react";
import { Image } from "src/components/Image";
import { Image as NBImage, Box } from "native-base";
import { ViewStyle, StyleProp, ImageStyle } from "react-native";

const User = require("src/assets/image/user.png");

type Props = {
  uri?: string | null;
  size?: number | string;
  style?: StyleProp<ImageStyle>;
} & ComponentProps<typeof Box>;

export const UserImage = ({ uri, size, style, ...props }: Props) => {
  return (
    <Box {...props}>
      {!!uri ? (
        // @ts-ignore
        <Image source={{ uri }} size={size} borderRadius="full" style={style} />
      ) : (
        <NBImage
          bg="#e0e0e0"
          borderRadius="full"
          source={User}
          size={size}
          alt="alt"
          style={style}
        />
      )}
    </Box>
  );
};

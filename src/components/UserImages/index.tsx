import React, { ComponentProps } from "react";
import { Box, HStack } from "native-base";
import { UserImage } from "../UserImage";

export const TRANSLATE_IMAGE_X = 10;

type Props = {
  data: (string | null)[];
  imageSize: ComponentProps<typeof UserImage>["size"];
  imageStyle?: ComponentProps<typeof UserImage>["style"];
} & ComponentProps<typeof HStack>;

export const UserImages = ({
  data,
  imageSize,
  imageStyle,
  ...props
}: Props) => {
  return (
    <HStack {...props}>
      {data.map((d, idx) => (
        <React.Fragment key={idx}>
          <Box
            zIndex={data.length - idx}
            style={{
              transform:
                idx !== 0
                  ? [{ translateX: idx * -TRANSLATE_IMAGE_X }]
                  : undefined,
            }}
          >
            <UserImage uri={d} size={imageSize} style={imageStyle} />
          </Box>
        </React.Fragment>
      ))}
    </HStack>
  );
};

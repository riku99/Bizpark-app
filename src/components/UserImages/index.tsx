import React, { ComponentProps } from "react";
import { HStack } from "native-base";
import { UserImage } from "../UserImage";

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
          <UserImage uri={d} size={imageSize} style={imageStyle} />
        </React.Fragment>
      ))}
    </HStack>
  );
};

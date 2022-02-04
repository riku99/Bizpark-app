import React from "react";
import {
  Box,
  Pressable,
  HStack,
  Text,
  Divider,
  useColorModeValue,
} from "native-base";
import { UserImages } from "../UserImages";
import { Badge } from "../Badge";

type Props = {
  title: string;
  text: string;
  allMessageSeen: boolean;
  onPress: () => void;
  onLongPress: () => void;
  userImageUrls: string[];
};

export const TalkRoomListItem = ({
  title,
  text,
  allMessageSeen,
  onPress,
  onLongPress,
  userImageUrls,
}: Props) => {
  const pressedColor = useColorModeValue("lt.pressed", "dt.pressed");
  const textGray = useColorModeValue("lt.textGray", "dt.textGray");

  return (
    <Pressable
      px="4"
      _pressed={{
        bg: pressedColor,
      }}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <HStack alignItems="center" py="4" justifyContent="space-between">
        <Box w="76%">
          <Text h="7" fontWeight="bold" fontSize="14">
            {title}
          </Text>

          <Text
            color={allMessageSeen ? textGray : undefined}
            h="7"
            fontWeight={!allMessageSeen ? "bold" : undefined}
          >
            {text}
          </Text>
          <UserImages data={userImageUrls} imageSize="8" mt="1" />
        </Box>

        {/* バッジ */}
        {!allMessageSeen && <Badge size="3" />}
      </HStack>

      <Divider />
    </Pressable>
  );
};

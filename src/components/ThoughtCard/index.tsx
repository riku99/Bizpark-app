import React, { ComponentProps, useState } from "react";
import { Box, useColorModeValue, Text, Flex } from "native-base";
import { Image } from "react-native-expo-image-cache";
import { CheckBox } from "../CheckBox";
import { useCreatePickMutation } from "src/generated/graphql";

type Props = {
  id: string;
  title: string | null;
  text: string;
  picked: boolean;
  contributor: {
    name: string;
    imageUrl: null | string;
  };
} & ComponentProps<typeof Box>;

export const ThoughtCard = ({
  id,
  title,
  text,
  contributor,
  picked,
  ...props
}: Props) => {
  const [checked, setChecked] = useState(picked);
  const [createPickMutation] = useCreatePickMutation();

  const onCheckPress = async () => {
    setChecked((c) => !c);
    const { data, errors } = await createPickMutation({
      variables: {
        input: {
          thoughtId: id,
        },
      },
    });

    console.log(data);
    console.log(errors);
  };

  return (
    <Box
      bg={useColorModeValue("white", "warmGray.800")}
      borderRadius="lg"
      py={14}
      px={4}
      shadow={2}
      {...props}
    >
      <Box flexDirection="row" alignItems="center">
        <Image
          uri={contributor.imageUrl}
          style={{ height: 34, width: 34, borderRadius: 34 }}
        />
        <Text fontWeight="bold" ml={2}>
          {contributor.name}
        </Text>
      </Box>
      {title && (
        <Text fontSize={16} fontWeight="bold" mt={2}>
          {title}
        </Text>
      )}
      <Text maxH={20} mt={!title ? 2 : 1}>
        {text}
      </Text>
      <Box mt={2} flexDirection="row" alignItems="center">
        <Text color="pink" fontWeight="bold" fontSize={16}>
          Pick
        </Text>
        <CheckBox
          onPress={onCheckPress}
          checked={checked}
          style={{ height: 26, width: 26, marginLeft: 6 }}
        />
      </Box>
    </Box>
  );
};

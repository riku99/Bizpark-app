import React, { ComponentProps, useState, useEffect } from "react";
import { Box, useColorModeValue, Text, Pressable, HStack } from "native-base";
import { CheckBox } from "../CheckBox";
import {
  useThoughtCacheFragment,
  useCreatePick,
  useDeletePick,
} from "src/hooks/apollo";
import FastImage from "react-native-fast-image";

type Props = {
  id: string;
} & ComponentProps<typeof Pressable>;

export const ThoughtCard = ({ id, ...props }: Props) => {
  const { readThoughtFragment } = useThoughtCacheFragment();
  const cacheData = readThoughtFragment(id);
  const [picked, setPicked] = useState(cacheData ? cacheData.picked : false);
  const [createPickMutation] = useCreatePick();
  const [deletePickMutation] = useDeletePick();

  useEffect(() => {
    if (cacheData) {
      setPicked(cacheData.picked);
    }
  }, [cacheData]);

  const onCheckPress = async () => {
    try {
      if (!picked) {
        setPicked(true);
        await createPickMutation({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } else {
        setPicked(false);
        await deletePickMutation({
          variables: {
            thoughtId: id,
          },
        });
      }
    } catch (e) {
      setPicked((c) => !c);
    }
  };

  return (
    <>
      {cacheData ? (
        <Pressable
          bg={useColorModeValue("white", "dt.darkGray")}
          borderRadius="lg"
          py={14}
          px={4}
          shadow={2}
          {...props}
        >
          <Box flexDirection="row" alignItems="center">
            <FastImage
              source={{ uri: cacheData.contributor.imageUrl }}
              style={{ height: 34, width: 34, borderRadius: 34 }}
            />
            <Text fontWeight="bold" ml={2}>
              {cacheData.contributor.name}
            </Text>
          </Box>

          {!!cacheData.title && (
            <Text fontSize={16} fontWeight="bold" mt={2}>
              {cacheData.title}
            </Text>
          )}

          <Text maxH={40} mt={!cacheData.title ? 2 : 1}>
            {cacheData.text}
          </Text>

          <HStack>
            {cacheData.images.map((img) => (
              <Box key={img.url}>
                <FastImage
                  source={{
                    uri: img.url,
                  }}
                  style={{ width: 50, height: 50 }}
                />
              </Box>
            ))}
          </HStack>

          <Box mt={2} flexDirection="row" alignItems="center">
            <Text color="pink" fontWeight="bold" fontSize={16}>
              Pick
            </Text>
            <CheckBox
              onPress={onCheckPress}
              checked={picked}
              style={{ height: 26, width: 26, marginLeft: 6 }}
            />
          </Box>
        </Pressable>
      ) : null}
    </>
  );
};

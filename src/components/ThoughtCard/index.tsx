import React, { ComponentProps, useState, useEffect } from "react";
import { Box, useColorModeValue, Text, Pressable, HStack } from "native-base";
import { CheckBox } from "../CheckBox";
import {
  useThoughtCacheFragment,
  useCreatePick,
  useDeletePick,
} from "src/hooks/apollo";
import { Image } from "src/components/Image";
import { UserImage } from "src/components/UserImage";
import { Pick } from "src/components/Pick";
import { ContentsCard } from "src/components/ContentsCard";

type Props = {
  id: string;
  onPress: () => void;
} & ComponentProps<typeof Box>;

export const ThoughtCard = ({ id, onPress, ...props }: Props) => {
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
        <ContentsCard borderRadius="lg" py={14} px={4} {...props}>
          <Pressable onPress={onPress}>
            <Box flexDirection="row" alignItems="center">
              <UserImage uri={cacheData.contributor.imageUrl} size={34} />
              <Text fontWeight="bold" ml={2}>
                {cacheData.contributor.name}
              </Text>
            </Box>

            {!!cacheData.title && (
              <Text fontSize={16} fontWeight="bold" mt={2}>
                {cacheData.title}
              </Text>
            )}

            <Text maxH={40} mt={!cacheData.title ? 2 : 1} fontSize={15}>
              {cacheData.text}
            </Text>

            <HStack space={2} mt={4}>
              {cacheData.images.map((img) => (
                <Image
                  key={img.id}
                  source={{
                    uri: img.url,
                  }}
                  size={70}
                  borderRadius="md"
                />
              ))}
            </HStack>

            <Pick
              mt={cacheData.images.length ? 4 : 2}
              textProp={{
                fontSize: 16,
              }}
              checkBoxProp={{
                onPress: onCheckPress,
                checked: picked,
                style: {
                  height: 26,
                  width: 26,
                  marginLeft: 6,
                },
              }}
            />
          </Pressable>
        </ContentsCard>
      ) : null}
    </>
  );
};

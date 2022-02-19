import React, { ComponentProps, useState, useEffect } from 'react';
import { Box, Text, Pressable, HStack } from 'native-base';
import {
  useThoughtCacheFragment,
  useCreatePick,
  useDeletePick,
} from 'src/hooks/apollo';
import { Image } from 'src/components/Image';
import { UserImage } from 'src/components/UserImage';
import { Pick } from 'src/components/Pick';
import { ContentsCard } from 'src/components/ContentsCard';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';
import LottieView from 'lottie-react-native';

const Like = require('../../assets/lottie/like.json');

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

  const navigation = useNavigation<RootNavigationProp<any>>();

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

  const onUserPress = () => {
    navigation.navigate('UserProfile', {
      id: cacheData.contributor.id,
    });
  };

  return (
    <>
      {cacheData ? (
        <ContentsCard borderRadius="lg" py={14} px={4} {...props}>
          <Pressable onPress={onPress}>
            <Pressable
              flexDirection="row"
              alignItems="center"
              onPress={onUserPress}
            >
              <UserImage uri={cacheData.contributor.imageUrl} size={34} />
              <Text fontWeight="bold" ml={2}>
                {cacheData.contributor.name}
              </Text>
            </Pressable>

            {!!cacheData.title && (
              <Text fontSize={16} fontWeight="bold" mt={2}>
                {cacheData.title}
              </Text>
            )}

            <Text maxH={40} mt={!cacheData.title ? 2 : 1} fontSize={15}>
              {cacheData.text}
            </Text>

            {!!cacheData.images.length && (
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
            )}

            <Pressable mt={cacheData.images.length ? 2 : 0}>
              <LottieView
                source={Like}
                autoPlay
                loop
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: -5,
                }}
              />
            </Pressable>

            {/* <Pick
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
            /> */}
          </Pressable>
        </ContentsCard>
      ) : null}
    </>
  );
};

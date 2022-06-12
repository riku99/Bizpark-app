import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Pressable, Text } from 'native-base';
import React, { ComponentProps, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ContentsCard } from 'src/components/ContentsCard';
import { Image } from 'src/components/Image';
import { UserImage } from 'src/components/UserImage';
import {
  useGetThoughtQuery,
  useLikeThoughtMutation,
  useUnlikeThoughtMutation,
} from 'src/generated/graphql';
import { RootNavigationProp } from 'src/types';
import { Like } from '../Like';

type Props = {
  id: string;
  onPress: () => void;
} & ComponentProps<typeof Box>;

export const ThoughtCard = ({ id, onPress, ...props }: Props) => {
  const { data: thoughtData } = useGetThoughtQuery({
    variables: {
      id,
    },
  });

  const [liked, setLiked] = useState(thoughtData?.thought.liked);
  const [likeAnimation, setLikeAnimation] = useState(false);

  useEffect(() => {
    setLiked(thoughtData?.thought.liked);
  }, [thoughtData?.thought.liked]);

  const [likeThought] = useLikeThoughtMutation();
  const [unlikeThought] = useUnlikeThoughtMutation();

  const onLikePress = async () => {
    if (liked) {
      // アンライク
      setLiked(false);
      try {
        await unlikeThought({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } catch (e) {
        setLiked(true);
      }
    } else {
      setLikeAnimation(true);
      setLiked(true);
      try {
        await likeThought({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } catch (e) {
        setLiked(false);
      }
    }
  };

  const navigation = useNavigation<RootNavigationProp<any>>();

  const onUserPress = () => {
    navigation.navigate('UserProfile', {
      id: thoughtData.thought.contributor.id,
    });
  };

  if (!thoughtData) {
    return null;
  }

  const { contributor, title, images, text } = thoughtData.thought;

  return (
    <ContentsCard borderRadius="lg" py={14} px={4} {...props}>
      <Pressable onPress={onPress}>
        <Pressable
          flexDirection="row"
          alignItems="center"
          onPress={onUserPress}
        >
          <UserImage uri={contributor.imageUrl} size={34} />
          <Text fontWeight="bold" ml={2}>
            {contributor.name}
          </Text>
        </Pressable>

        {!!title && (
          <Text fontSize={16} fontWeight="bold" mt={2}>
            {title}
          </Text>
        )}

        <Text maxH={40} mt={!title ? 2 : 1} fontSize={15}>
          {text}
        </Text>

        {!!images.length && (
          <HStack space={2} mt={4}>
            {images.map((img) => (
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

        <Like
          lottieStyle={styles.like}
          liked={liked}
          mt={images.length ? 2 : 0}
          onPress={onLikePress}
          w="5"
          likeAnimation={likeAnimation}
          setLikeAnimation={setLikeAnimation}
        />
      </Pressable>
    </ContentsCard>
  );
};

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  like: {
    width: 22,
    aspectRatio: width / height,
  },
});

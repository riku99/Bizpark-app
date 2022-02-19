import React, { ComponentProps, useState, useEffect, useRef } from 'react';
import { Box, Text, Pressable, HStack } from 'native-base';
import { Image } from 'src/components/Image';
import { UserImage } from 'src/components/UserImage';
import { ContentsCard } from 'src/components/ContentsCard';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from 'src/types';
import LottieView from 'lottie-react-native';
import {
  useGetThoughtQuery,
  useLikeThoughtMutation,
  useUnlikeThoughtMutation,
} from 'src/generated/graphql';
import { StyleSheet } from 'react-native';

const Like = require('../../assets/lottie/like.json');

type Props = {
  id: string;
  onPress: () => void;
} & ComponentProps<typeof Box>;

export const ThoughtCard = ({ id, onPress, ...props }: Props) => {
  const likeRef = useRef<LottieView>(null);
  const isInitialRender = useRef(true);

  const { data: thoughtData } = useGetThoughtQuery({
    variables: {
      id,
    },
  });

  const [liked, setLiked] = useState(thoughtData?.thought.liked);

  useEffect(() => {
    setLiked(thoughtData?.thought.liked);
  }, [thoughtData?.thought.liked]);

  useEffect(() => {
    if (isInitialRender.current) {
      if (liked) {
        likeRef.current.play(77, 77);
      } else {
        likeRef.current.play(0, 0);
      }
      isInitialRender.current = false;
    } else {
      if (liked) {
        // いいねアニメーション
        likeRef.current.play();
      } else {
        // 外すアニメーション
        likeRef.current.play(40, 0);
      }
    }
  }, [liked]);

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

        <Pressable mt={images.length ? 2 : 0} onPress={onLikePress}>
          <LottieView
            ref={likeRef}
            source={Like}
            autoPlay={false}
            loop={false}
            speed={1.8}
            style={styles.like}
          />
        </Pressable>
      </Pressable>
    </ContentsCard>
  );
};

const styles = StyleSheet.create({
  like: {
    width: 50,
    height: 50,
    marginLeft: -5,
  },
});

import React, { ComponentProps, useRef, useEffect } from 'react';
import { Pressable } from 'native-base';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { GestureResponderEvent } from 'react-native';

const Source = require('../../assets/lottie/like.json');

type Props = {
  liked: boolean;
  likeAnimation?: boolean;
  setLikeAnimation?: (value: boolean) => void;
  lottieStyle: ComponentProps<typeof LottieView>['style'];
} & ComponentProps<typeof Pressable>;

export const Like = ({
  liked,
  lottieStyle,
  likeAnimation,
  setLikeAnimation,
  ...props
}: Props) => {
  const likeRef = useRef<LottieView>(null);

  useEffect(() => {
    if (!likeAnimation) {
      if (liked) {
        likeRef.current?.play(1000, 1000);
      } else {
        likeRef.current?.play(0, 0);
      }
    } else {
      if (liked) {
        // いいねアニメーション
        likeRef.current?.play();
        setTimeout(() => {
          if (setLikeAnimation) {
            setLikeAnimation(false);
          }
        }, 1000);
      } else {
        likeRef.current?.play(0, 0);
      }
    }
  }, [liked, likeAnimation, setLikeAnimation]);

  const onPress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    props.onPress(e);
  };

  return (
    <Pressable {...props} onPress={onPress}>
      <LottieView
        ref={likeRef}
        source={Source}
        autoPlay={false}
        loop={false}
        speed={1.8}
        style={lottieStyle}
        resizeMode="cover"
      />
    </Pressable>
  );
};

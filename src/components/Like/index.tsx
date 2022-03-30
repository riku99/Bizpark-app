import React, { ComponentProps, useRef, useEffect } from 'react';
import { Pressable } from 'native-base';
import LottieView from 'lottie-react-native';

const Source = require('../../assets/lottie/like.json');

type Props = {
  liked: boolean;
  lottieStyle: ComponentProps<typeof LottieView>['style'];
} & ComponentProps<typeof Pressable>;

export const Like = ({ liked, lottieStyle, ...props }: Props) => {
  const likeRef = useRef<LottieView>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      if (liked) {
        likeRef.current?.play(1000, 1000);
      } else {
        likeRef.current?.play(0, 0);
      }
      if (liked != undefined) {
        isInitialRender.current = false;
      }
    } else {
      if (liked) {
        // いいねアニメーション
        likeRef.current?.play();
      } else {
        // 外すアニメーション
        likeRef.current?.play(0, 0);
      }
    }
  }, [liked]);

  return (
    <Pressable {...props}>
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

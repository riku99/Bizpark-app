import React from "react";
import Swiper from "react-native-swiper";
import { Box, Text, useTheme } from "native-base";
import Browsing from "src/assets/svg/browsing.svg";
import Post from "src/assets/svg/post.svg";
import Chatting from "src/assets/svg/chatting.svg";
import { HIGHER_8_DEVICE } from "src/constants";

type ContentProps = {
  children: JSX.Element;
  text: string;
};

const Content = ({ children, text }: ContentProps) => {
  return (
    <Box alignItems="center">
      {children}
      <Text fontWeight="bold" mt={4} fontSize={18}>
        {text}
      </Text>
    </Box>
  );
};

const First = () => {
  return (
    <Content text="様々な考え、感性に触れよう">
      <Browsing width={SVG_SIZE} height={SVG_SIZE} />
    </Content>
  );
};

const Second = () => {
  return (
    <Content text={`考えや知ったことを気軽に載せよう`}>
      <Post width={SVG_SIZE} height={SVG_SIZE} />
    </Content>
  );
};

const Third = () => {
  return (
    <Content text="トークで思考と輪を広げよう">
      <Chatting width={SVG_SIZE} height={SVG_SIZE} />
    </Content>
  );
};

export const SwipeContent = () => {
  const { colors } = useTheme();

  return (
    <Swiper
      activeDotStyle={{
        backgroundColor: colors.purple,
      }}
      dotStyle={{
        backgroundColor: "#b5b5b5",
      }}
      autoplay
    >
      <First />
      <Second />
      <Third />
    </Swiper>
  );
};

const SVG_SIZE = HIGHER_8_DEVICE ? 200 : 180;

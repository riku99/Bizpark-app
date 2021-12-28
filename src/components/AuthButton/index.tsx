import React from "react";
import { Box, Pressable, Text } from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import GoogleIcon from "src/assets/svg/google.svg";

type BaseProps = {
  icon: JSX.Element;
  title: string;
  bg: string;
  titleColor?: string;
};

const Base = ({ icon, title, bg, titleColor }: BaseProps) => {
  return (
    <Pressable
      flexDirection="row"
      bg={bg}
      h={12}
      alignItems="center"
      borderRadius="sm"
    >
      <Box position={"absolute"} left={2}>
        {icon}
      </Box>
      <Text flex={1} textAlign="center" fontWeight="bold" color={titleColor}>
        {title}
      </Text>
    </Pressable>
  );
};

export const Mail = () => {
  return (
    <Base
      bg="pink"
      title="メールアドレスで登録"
      icon={<MaterialIcons name="email" color="white" size={22} />}
    />
  );
};

export const Apple = () => {
  return (
    <Base
      bg="black"
      title="Appleで登録"
      icon={<AntDesign name="apple1" color="white" size={22} />}
    />
  );
};

export const Google = () => {
  return (
    <Base
      title="Googleで登録"
      bg="white"
      titleColor="black"
      icon={<GoogleIcon width={22} height={22} />}
    />
  );
};

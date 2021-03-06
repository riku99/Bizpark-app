import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Box, Pressable, Text } from 'native-base';
import React, { ComponentProps } from 'react';
import GoogleIcon from 'src/assets/svg/google.svg';

type BaseProps = {
  icon: JSX.Element;
  title: string;
  bg: string;
  titleColor?: string;
} & ComponentProps<typeof Pressable>;

const Base = ({ icon, title, bg, titleColor, ...props }: BaseProps) => {
  return (
    <Pressable
      flexDirection="row"
      bg={bg}
      h={12}
      alignItems="center"
      borderRadius="sm"
      {...props}
    >
      <Box position={'absolute'} left={2}>
        {icon}
      </Box>
      <Text flex={1} textAlign="center" fontWeight="bold" color={titleColor}>
        {title}
      </Text>
    </Pressable>
  );
};

type Props = { type?: 'signin' | 'signup'; onPress?: () => void };

export const Mail = ({ onPress, type = 'signup' }: Props) => {
  return (
    <Base
      bg="pink"
      title={`メールアドレスで${type === 'signup' ? '登録' : 'ログイン'}`}
      icon={<MaterialIcons name="email" color="white" size={22} />}
      onPress={onPress}
      titleColor="white"
    />
  );
};

export const Apple = ({ onPress, type = 'signup' }: Props) => {
  return (
    <Base
      bg="black"
      title="Appleで登録・ログイン"
      icon={<AntDesign name="apple1" color="white" size={22} />}
      onPress={onPress}
      titleColor="white"
    />
  );
};

export const Google = ({ onPress, type = 'signup' }: Props) => {
  return (
    <Base
      title="Googleで登録・ログイン"
      bg="white"
      titleColor="black"
      icon={<GoogleIcon width={22} height={22} />}
      onPress={onPress}
      borderWidth={1}
      borderColor="#cfcfcf"
    />
  );
};

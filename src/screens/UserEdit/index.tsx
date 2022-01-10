import React, { useLayoutEffect, ComponentProps } from "react";
import {
  Box,
  ScrollView,
  VStack,
  Text,
  Pressable,
  useColorModeValue,
  HStack,
} from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useMeQuery } from "src/generated/graphql";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { socialIcons } from "src/constants";

type ItemProps = {
  label: string;
  value: string;
} & ComponentProps<typeof Pressable>;
const Item = ({ label, value, ...props }: ItemProps) => {
  return (
    <Pressable {...props}>
      <Text fontWeight="bold" color={useColorModeValue("gray.600", "gray.300")}>
        {label}
      </Text>
      <Text fontWeight="bold" fontSize="16" mt="2">
        {value}
      </Text>
    </Pressable>
  );
};

type Props = RootNavigationScreenProp<"UserEdit">;

export const UserEditScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "プロフィール編集",
    });
  }, [navigation]);

  const { data } = useMeQuery();

  if (!data) {
    return null;
  }

  const { imageUrl, name, bio } = data.me;

  return (
    <ScrollView flex={1} px="4" pt="8">
      <UserImage uri={imageUrl} size={16} alignSelf="center" />

      <VStack mt="12" space={8}>
        <Item label="名前" value={name} />
        <Item label="自己紹介" value={bio} maxH="20" />
      </VStack>

      <HStack mt="16" space={4}>
        {socialIcons.map((s, idx) => {
          console.log(socialIcons);
          return (
            <SocialIcon
              type={s}
              iconType="font-awesome"
              key={idx}
              raised={false}
              style={{
                width: 40,
                height: 40,
              }}
            />
          );
        })}
      </HStack>
    </ScrollView>
  );
};

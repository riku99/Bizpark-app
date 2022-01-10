import React from "react";
import { Box, useColorModeValue, Text, HStack, Pressable } from "native-base";
import { ContentsCard } from "src/components/ContentsCard";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { StyleSheet } from "react-native";
import { Social, SocialType } from "src/generated/graphql";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { useMeQuery } from "src/generated/graphql";

type Props = {
  id: string;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  socials: Omit<Social, "userId">[];
};

export const Profile = ({ id, name, imageUrl, bio, socials }: Props) => {
  const { data } = useMeQuery();
  const navigation = useNavigation<RootNavigationProp<any>>();

  const icons = socials.map((s) => {
    let data: {
      type: SocialIconProps["type"];
      link: string;
    };
    switch (s.type) {
      case SocialType.Facebook:
        data = {
          type: "facebook",
          link: s.link,
        };
        break;
      case SocialType.Instagram:
        data = {
          type: "instagram",
          link: s.link,
        };
        break;
      case SocialType.Linkedin:
        data = {
          type: "linkedin",
          link: s.link,
        };
        break;
      case SocialType.Twitter:
        data = {
          type: "twitter",
          link: s.link,
        };
        break;
    }

    return data;
  });

  const isMe = data && data.me.id && data.me.id === id;

  return (
    <>
      <ContentsCard
        w="5/6"
        px="4"
        pb="8"
        borderRadius="lg"
        shadow="1"
        minH="2/3"
      >
        <>
          <Box>
            <Text fontWeight="bold" fontSize="16" alignSelf="center" mt="12">
              {name}
            </Text>

            <HStack alignSelf="center" mt="2">
              {icons.map((l, idx) => (
                <SocialIcon
                  type={l.type}
                  iconType={"font-awesome"}
                  key={idx}
                  raised={false}
                  iconSize={20}
                  style={styles.social}
                />
              ))}
            </HStack>

            <Box mt="4">
              <Text lineHeight="lg">{bio}</Text>
            </Box>
          </Box>

          {isMe && (
            <Pressable
              position="absolute"
              top="4"
              right="4"
              borderWidth="1"
              borderColor={useColorModeValue("textBlack", "textWhite")}
              p="2"
              borderRadius="2xl"
            >
              <Text
                fontWeight="bold"
                onPress={() => {
                  navigation.navigate("UserEdit");
                }}
              >
                編集
              </Text>
            </Pressable>
          )}
        </>
      </ContentsCard>

      <ContentsCard borderRadius="full" shadow="0" style={styles.imageOuter}>
        <UserImage uri={imageUrl} style={styles.image} />
      </ContentsCard>
    </>
  );
};

const IMAGE_SIZE = 60;
const IMAGE_OUTER_SIZE = IMAGE_SIZE + 10;

const styles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  imageOuter: {
    width: IMAGE_OUTER_SIZE,
    height: IMAGE_OUTER_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 22,
  },
  social: {
    width: 35,
    height: 35,
  },
});

import React from "react";
import { Box, useColorModeValue, Text, HStack, ScrollView } from "native-base";
import { ContentsCard } from "src/components/ContentsCard";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { StyleSheet } from "react-native";
import { Social, SocialType } from "src/generated/graphql";

const image =
  "https://kuro-bucket-sample.s3.ap-northeast-1.amazonaws.com/IMG_0261.HEIC";

// const icons: SocialIconProps["type"][] = [
//   "facebook",
//   "twitter",
//   "linkedin",
//   "instagram",
// ];

// const bio =
//   "初めましてBizparkの製作者です。スタートアップでエンジニアインターンとして働いています。サービスやビジネスやテクノロジーが好きで、自分で事業を起こすためにプログラムを書き始めました。何か要望ありましたら是非メッセージ送ってください!";

type Props = {
  id: string;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  socials: Omit<Social, "userId">[];
};

export const Profile = ({ name, imageUrl, bio, socials }: Props) => {
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

        <Box position="absolute" top="4" right="8">
          <Text>編集</Text>
        </Box>
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
    top: 36,
  },
  social: {
    width: 35,
    height: 35,
  },
});

import React from "react";
import { Box, useColorModeValue, Text, HStack, ScrollView } from "native-base";
import { ContentsCard } from "src/components/ContentsCard";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { StyleSheet } from "react-native";

const image =
  "https://kuro-bucket-sample.s3.ap-northeast-1.amazonaws.com/IMG_0261.HEIC";

const icons = ["facebook", "twitter", "linkedin", "instagram"];

const bio =
  "初めましてBizparkの製作者です。スタートアップでエンジニアインターンとして働いています。サービスやビジネスやテクノロジーが好きで、自分で事業を起こすためにプログラムを書き始めました。何か要望ありましたら是非メッセージ送ってください!";

export const Profile = () => {
  return (
    <>
      <ContentsCard
        w="4/5"
        px="4"
        pb="8"
        borderRadius="lg"
        shadow="1"
        minH="2/3"
      >
        <Box>
          <Text fontWeight="bold" fontSize="16" alignSelf="center" mt="12">
            Riku
          </Text>

          <HStack alignSelf="center" mt="2">
            {icons.map((l, idx) => (
              <SocialIcon
                type={l}
                iconType={"font-awesome"}
                key={idx}
                raised={false}
                iconSize={20}
                style={styles.social}
              />
            ))}
          </HStack>

          <Box mt="4">
            <Text>{bio}</Text>
          </Box>
        </Box>
      </ContentsCard>

      <ContentsCard borderRadius="full" shadow="0" style={styles.imageOuter}>
        <UserImage uri={image} size="16" />
      </ContentsCard>
    </>
  );
};

const styles = StyleSheet.create({
  imageOuter: {
    width: 74,
    height: 74,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 32,
  },
  social: {
    width: 35,
    height: 35,
  },
});

import React from "react";
import { Box, useColorModeValue, Text, HStack, Pressable } from "native-base";
import { ContentsCard } from "src/components/ContentsCard";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { useMeQuery } from "src/generated/graphql";
import { Linking, Alert } from "react-native";
import { INSTAGRAM_BASE_URL, TWITTER_BASE_URL } from "src/constants";
import { FollowButton } from "./FollowButton";

type Props = {
  id: string;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  socials: { type: SocialIconProps["type"]; value: string | null }[];
  follow?: boolean;
};

export const Profile = ({
  id,
  name,
  imageUrl,
  bio,
  socials,
  follow,
}: Props) => {
  const { data } = useMeQuery();
  const navigation = useNavigation<RootNavigationProp<any>>();

  const isMe = data && data.me.id && data.me.id === id;

  const onSnsIconPress = async ({
    type,
    value,
  }: {
    type: SocialIconProps["type"];
    value: string;
  }) => {
    const notSupportedAlert = () => {
      Alert.alert("無効なURLです");
    };

    let link = value;
    switch (type) {
      case "instagram":
        link = `${INSTAGRAM_BASE_URL}/${value}`;
        break;
      case "twitter":
        link = `${TWITTER_BASE_URL}/${value}`;
        break;
    }

    try {
      const supported = await Linking.canOpenURL(link);

      if (supported) {
        await Linking.openURL(link);
      } else {
        notSupportedAlert();
      }
    } catch (e) {
      notSupportedAlert();
    }
  };

  return (
    <>
      <ContentsCard
        w="85%"
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

            <HStack alignSelf="center" mt="4" space="2">
              {socials.map((l, idx) => (
                <React.Fragment key={idx}>
                  {!!l.value && (
                    <SocialIcon
                      type={l.type}
                      iconType={"font-awesome"}
                      raised={false}
                      iconSize={20}
                      style={styles.social}
                      onPress={() => {
                        onSnsIconPress({ type: l.type, value: l.value });
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </HStack>

            <Box mt="4">
              <Text lineHeight="lg">{bio}</Text>
            </Box>
          </Box>

          {isMe ? (
            <Pressable
              position="absolute"
              top="4"
              right="4"
              borderWidth="1"
              borderColor={useColorModeValue("textBlack", "textWhite")}
              p="2"
              borderRadius="2xl"
              onPress={() => {
                navigation.navigate("UserEdit");
              }}
            >
              <Text fontWeight="bold">編集</Text>
            </Pressable>
          ) : (
            <FollowButton userId={id} follow={follow} />
          )}

          <ContentsCard
            borderRadius="full"
            shadow="0"
            style={styles.imageOuter}
          >
            <UserImage uri={imageUrl} style={styles.image} />
          </ContentsCard>
        </>
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
    alignSelf: "center",
    transform: [{ translateY: -40 }],
  },
  social: {
    width: 35,
    height: 35,
  },
});

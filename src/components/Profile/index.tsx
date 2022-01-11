import React from "react";
import { Box, useColorModeValue, Text, HStack, Pressable } from "native-base";
import { ContentsCard } from "src/components/ContentsCard";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProp } from "src/types";
import { useMeQuery } from "src/generated/graphql";

type Props = {
  id: string;
  name: string;
  imageUrl: string | null;
  bio: string | null;
  socials: { type: SocialIconProps["type"]; value: string | null }[];
};

export const Profile = ({ id, name, imageUrl, bio, socials }: Props) => {
  const { data } = useMeQuery();
  const navigation = useNavigation<RootNavigationProp<any>>();

  const isMe = data && data.me.id && data.me.id === id;

  console.log(data.me.imageUrl);
  console.log(imageUrl);

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
                    />
                  )}
                </React.Fragment>
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

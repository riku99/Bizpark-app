import React, { useLayoutEffect, useState } from "react";
import { Box, ScrollView, VStack, Pressable, HStack } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useMeQuery, SocialType } from "src/generated/graphql";
import { UserImage } from "src/components/UserImage";
import { SocialIcon } from "react-native-elements";
import { socialIcons } from "src/constants";
import ImagePicker from "react-native-image-crop-picker";
import { Item } from "./EditItem";
import { AvatarMenu } from "./AvatarMenu";

type Props = RootNavigationScreenProp<"UserEdit">;

export const UserEditScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "プロフィール編集",
    });
  }, [navigation]);

  const { data } = useMeQuery();
  const facebookData = data.me.socials.find(
    (s) => s.type === SocialType.Facebook
  );
  const twitterData = data.me.socials.find(
    (s) => s.type === SocialType.Twitter
  );
  const linkedinData = data.me.socials.find(
    (s) => s.type === SocialType.Linkedin
  );
  const instagramData = data.me.socials.find(
    (s) => s.type === SocialType.Instagram
  );

  const [imageUrl, setImageUrl] = useState(data.me.imageUrl);
  const [name, setName] = useState(data.me.name);
  const [bio, setBio] = useState(data.me.bio);
  const [facebook, setFacebook] = useState(
    facebookData ? facebookData.link : null
  );
  const [twitter, setTwitter] = useState(twitterData ? twitterData.link : null);
  const [linkedIn, setLinkedIn] = useState(
    linkedinData ? linkedinData.link : null
  );
  const [instagram, setInstagram] = useState(
    instagramData ? instagramData.link : null
  );

  const onAvatarAction = async (id: string) => {
    if (id === "select") {
      try {
        const image = await ImagePicker.openPicker({
          multiple: false,
          mediaType: "photo",
        });
        setImageUrl(image.sourceURL);
      } catch (e) {}
    }

    if (id === "delete") {
      setImageUrl(null);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <ScrollView flex={1} px="4" pt="8">
      <AvatarMenu onAction={onAvatarAction}>
        <UserImage uri={imageUrl} size={16} alignSelf="center" />
      </AvatarMenu>

      <VStack mt="12" space={8}>
        <Item label="名前" value={name} />
        <Item label="自己紹介" value={bio} maxH="20" />
      </VStack>

      <HStack mt="16" space={4}>
        {socialIcons.map((s, idx) => {
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

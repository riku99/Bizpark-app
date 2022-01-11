import React, { useLayoutEffect, useState } from "react";
import { Box, ScrollView, VStack, Pressable, HStack, Text } from "native-base";
import { RootNavigationScreenProp, Socials } from "src/types";
import {
  useMeQuery,
  useUploadImageMutation,
  useUpdateMeMutation,
} from "src/generated/graphql";
import { UserImage } from "src/components/UserImage";
import { SocialIcon, SocialIconProps } from "react-native-elements";
import { socialIcons } from "src/constants";
import ImagePicker from "react-native-image-crop-picker";
import { Item } from "./EditItem";
import { AvatarMenu } from "./AvatarMenu";
import { ReactNativeFile } from "apollo-upload-client";
import { spinnerVisibleVar } from "src/stores/spinner";

type Props = RootNavigationScreenProp<"UserEdit">;

export const UserEditScreen = ({ navigation }: Props) => {
  const { data } = useMeQuery();

  const [image, setImage] = useState({
    url: data.me.imageUrl,
    mime: null,
  });
  const [name, setName] = useState(data.me.name);
  const [bio, setBio] = useState(data.me.bio);
  const [facebook, setFacebook] = useState(data.me.facebook);
  const [twitter, setTwitter] = useState(data.me.twitter);
  const [linkedin, setLinkedin] = useState(data.me.linkedin);
  const [instagram, setInstagram] = useState(data.me.instagram);

  const [updateMeMutation] = useUpdateMeMutation();
  const [uploadImageMutation] = useUploadImageMutation();

  const onCompletePress = async () => {
    try {
      spinnerVisibleVar(true);
      let imageUrl: null | string = null;
      if (image.url) {
        const file = new ReactNativeFile({
          uri: image.url,
          type: image.mime,
          name: `image-${Date.now()}`,
        });
        const { data } = await uploadImageMutation({
          variables: {
            file,
          },
        });

        imageUrl = data.uploadImage.url;
      }

      await updateMeMutation({
        variables: {
          input: {
            name,
            bio,
            imageUrl,
            facebook: facebook ?? null,
            twitter: twitter ?? null,
            linkedin: linkedin ?? null,
            instagram: instagram ?? null,
          },
        },
      });

      navigation.goBack();
    } catch (e) {
      console.log(e);
    } finally {
      spinnerVisibleVar(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "プロフィール編集",
      headerRight: () => (
        <Pressable onPress={onCompletePress}>
          <Text fontWeight="bold" color="pink" fontSize="17">
            完了
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, onCompletePress]);

  const socialsStateData = socialIcons.map((s) => {
    switch (s) {
      case "facebook":
        return {
          type: "facebook",
          value: facebook,
          setValue: setFacebook,
        };
      case "twitter":
        return {
          type: "twitter",
          value: twitter,
          setValue: setTwitter,
        };
      case "linkedin":
        return {
          type: "linkedin",
          value: linkedin,
          setValue: setLinkedin,
        };
      case "instagram":
        return {
          type: "instagram",
          value: instagram,
          setValue: setInstagram,
        };
    }
  });

  const onAvatarAction = async (id: string) => {
    if (id === "select") {
      try {
        const image = await ImagePicker.openPicker({
          multiple: false,
          mediaType: "photo",
        });
        setImage({
          url: image.sourceURL,
          mime: image.mime,
        });
      } catch (e) {}
    }

    if (id === "delete") {
      setImage({
        url: null,
        mime: null,
      });
    }
  };

  if (!data) {
    return null;
  }

  return (
    <ScrollView flex={1} px="4" pt="8">
      <AvatarMenu onAction={onAvatarAction}>
        <UserImage uri={image.url} size={16} alignSelf="center" />
      </AvatarMenu>

      <VStack mt="12" space={8}>
        <Item
          label="名前"
          value={name}
          onPress={() => {
            navigation.navigate("UserItemEdit", {
              type: "name",
              value: name,
              setValue: setName,
            });
          }}
        />
        <Item
          label="自己紹介"
          value={bio}
          maxH="20"
          onPress={() => {
            navigation.navigate("UserItemEdit", {
              type: "bio",
              value: bio,
              setValue: setBio,
            });
          }}
        />
      </VStack>

      <HStack mt="16" space={4}>
        {socialsStateData.map((s, idx) => {
          return (
            <SocialIcon
              type={s.type as SocialIconProps["type"]}
              iconType="font-awesome"
              key={idx}
              raised={false}
              style={{
                width: 40,
                height: 40,
              }}
              onPress={() => {
                navigation.navigate("UserItemEdit", {
                  type: s.type as Socials,
                  value: s.value,
                  setValue: s.setValue,
                });
              }}
            />
          );
        })}
      </HStack>
    </ScrollView>
  );
};

import React from "react";
import { ScrollView } from "native-base";
import { useMeQuery } from "src/generated/graphql";
import { Profile } from "src/components/Profile";
import { SocialIconProps } from "react-native-elements";

export const MyProfile = () => {
  const { data } = useMeQuery();

  if (!data) {
    console.log("no me data!!");
    return null;
  }

  const {
    id,
    name,
    bio,
    imageUrl,
    instagram,
    facebook,
    twitter,
    linkedin,
  } = data.me;
  const socials: { type: SocialIconProps["type"]; value: string | null }[] = [
    { type: "facebook", value: facebook },
    { type: "twitter", value: twitter },
    { type: "linkedin", value: linkedin },
    { type: "instagram", value: instagram },
  ];

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 50,
      }}
    >
      <Profile
        id={id}
        name={name}
        bio={bio}
        imageUrl={imageUrl}
        socials={socials}
      />
    </ScrollView>
  );
};

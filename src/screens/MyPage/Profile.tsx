import React from "react";
import { Box, ScrollView } from "native-base";
import { useMeQuery } from "src/generated/graphql";
import { Profile } from "src/components/Profile";

export const MyProfile = () => {
  const { data } = useMeQuery();

  if (!data) {
    console.log("no me data!!");
    return null;
  }

  const { id, name, bio, imageUrl, socials } = data.me;

  console.log(socials);

  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{
        alignItems: "center",
        paddingTop: 76,
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

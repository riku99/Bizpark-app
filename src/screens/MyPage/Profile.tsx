import React, { useState } from "react";
import { ScrollView } from "native-base";
import { useMeQuery } from "src/generated/graphql";
import { Profile } from "src/components/Profile";
import { SocialIconProps } from "react-native-elements";
import { RefreshControl } from "src/components/RefreshControl";
import { AddButton } from "src/components/AddButton";

export const MyProfile = () => {
  const { data, refetch } = useMeQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!data) {
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
    <>
      <ScrollView
        flex={1}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 50,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Profile
          id={id}
          name={name}
          bio={bio}
          imageUrl={imageUrl}
          socials={socials}
          isMe={true}
        />
      </ScrollView>

      <AddButton />
    </>
  );
};

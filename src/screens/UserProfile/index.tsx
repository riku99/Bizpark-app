import React, { useLayoutEffect, useState } from "react";
import { ScrollView } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useUserCacheFragment } from "src/hooks/users";
import { useUserLazyQuery } from "src/generated/graphql";
import { SocialIconProps } from "react-native-elements";
import { Profile } from "src/components/Profile";
import { RefreshControl } from "src/components/RefreshControl";

type Props = RootNavigationScreenProp<"UserProfile">;

// MyPageで表示するプロフィール以外のプロフィール画面
export const UserProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { readUserFragment } = useUserCacheFragment();
  const cacheData = readUserFragment({ id });
  const [getUser] = useUserLazyQuery();
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: cacheData ? cacheData.name : "ユーザーが存在しません",
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUser({ variables: { id } });
    setRefreshing(false);
  };

  if (!cacheData) {
    return null;
  }

  const {
    name,
    imageUrl,
    bio,
    instagram,
    facebook,
    twitter,
    linkedin,
  } = cacheData;
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
      />
    </ScrollView>
  );
};

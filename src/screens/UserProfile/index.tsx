import React, { useLayoutEffect } from "react";
import { Box } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useUserCacheFragment } from "src/hooks/users";
import { useUserQuery } from "src/generated/graphql";

type Props = RootNavigationScreenProp<"UserProfile">;

// MyPageで表示するプロフィール以外のプロフィール画面
export const UserProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  // const { data } = useUserQuery({
  //   variables: {
  //     id,
  //   },
  // });
  const { readUserFragment } = useUserCacheFragment();
  const cacheData = readUserFragment({ id });

  console.log(cacheData);

  // if (data) {
  //   // console.log(data.user);
  // }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "hey",
    });
  }, []);

  return <Box></Box>;
};

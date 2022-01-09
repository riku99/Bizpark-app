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

  return (
    <ScrollView flex={1}>
      <Profile />
    </ScrollView>
  );
};

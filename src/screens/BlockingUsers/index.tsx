import React, { useLayoutEffect, useCallback } from "react";
import { Box, Button } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useBlockingUsersQuery, User } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { FlatList, StyleSheet } from "react-native";
import { UserImage } from "src/components/UserImage";
import { ListItem } from "src/components/ListItem";

type Props = RootNavigationScreenProp<"BlockingUsers">;

export const BlockingUsersScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ブロックリスト",
    });
  }, [navigation]);

  const { data } = useBlockingUsersQuery();

  const renderItem = useCallback(({ item }: { item: User }) => {
    return (
      <ListItem
        title={item.name}
        ItemLeft={<UserImage uri={item.imageUrl} size="10" />}
        ItemRight={
          <Button py="0" h="7">
            解除
          </Button>
        }
      />
    );
  }, []);

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.blockingUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};

const styles = StyleSheet.create({});

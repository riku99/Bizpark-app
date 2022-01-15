import React, { useLayoutEffect, useCallback } from "react";
import { Box, Text, HStack, Pressable, Button } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useBlockingUsersQuery, User } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { FlatList, StyleSheet } from "react-native";
import { UserImage } from "src/components/UserImage";

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
      <Pressable onPress={() => {}}>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          h="16"
          px="4"
        >
          <HStack alignItems="center">
            <UserImage uri={item.imageUrl} size="10" />
            <Text ml="4" fontWeight="bold">
              {item.name}
            </Text>
          </HStack>

          <Button py="0" h="7">
            解除
          </Button>
        </HStack>
      </Pressable>
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

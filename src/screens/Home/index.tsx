import React, { useLayoutEffect, useCallback } from "react";
import { VStack, Button, useColorMode, Text } from "native-base";
import { RootNavigationProp } from "types";
import { Bg } from "src/components/Bg";
import { ThoughtCard } from "src/components/ThoughtCard";
import { FlatList } from "react-native";
import { useThoughtsQuery, Genre, Thought } from "src/generated/graphql";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { List } from "./List";

type Props = RootNavigationProp<"Tab">;

const TopTab = createMaterialTopTabNavigator();

export const HomeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
      // headerLeft: () => <Text>Logo</Text>,
    });
  }, [navigation]);
  const { toggleColorMode } = useColorMode();

  const [result, reexecuteQuery] = useThoughtsQuery({
    variables: { genre: Genre.Business },
  });
  const { data, error } = result;

  const renderItem = useCallback(
    ({ item, index }: { item: Thought; index: number }) => {
      return (
        <ThoughtCard
          title={item.title}
          text={item.text}
          contributor={{
            name: item.contributor.name,
            imageUrl: item.contributor.imageUrl,
          }}
          picked={false}
          key={item.id}
          mt={index !== 0 ? 4 : 0}
        />
      );
    },
    []
  );

  if (!data) {
    return null;
  }

  return (
    <Bg flex={1} pt={1}>
      <VStack px={4}>
        <List data={data.thoughts} />
      </VStack>
      {/* <Button
        position="absolute"
        w={50}
        h={30}
        bottom={30}
        onPress={toggleColorMode}
      >
        toggle
      </Button> */}
    </Bg>
  );
};

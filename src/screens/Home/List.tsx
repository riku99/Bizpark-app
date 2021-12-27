import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { ThoughtsQuery } from "src/generated/graphql";
import { ThoughtCard } from "src/components/ThoughtCard";

type QueryItemData = ThoughtsQuery["thoughts"][number];
type Props = { data: QueryItemData[] };

export const List = ({ data }: Props) => {
  const renderItem = useCallback(
    ({ item, index }: { item: QueryItemData; index: number }) => {
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

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}
    />
  );
};

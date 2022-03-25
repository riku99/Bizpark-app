import React, { useLayoutEffect, useCallback, useState } from 'react';
import { Box, Pressable, Text, Divider } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useReactiveVar } from '@apollo/client';
import { tabOrderVar, changedTabOrderVar } from 'src/stores/tabOrder';

type Props = RootNavigationScreenProp<'TabOrderChange'>;

export const TabOrderChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '順番の並び替え',
    });
  }, [navigation]);

  const tabOrder = useReactiveVar(tabOrderVar);
  const initialData = tabOrder.map(({ key, label }) => {
    return {
      key,
      label,
    };
  });

  const [data, setData] = useState(initialData);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<typeof data[number]>) => {
      return (
        <>
          <ScaleDecorator>
            <Pressable onLongPress={drag} disabled={isActive} py="4" px="6">
              <Text fontWeight="bold">{item.label}</Text>
            </Pressable>
          </ScaleDecorator>
          <Divider ml="5" />
        </>
      );
    },
    []
  );

  return (
    <Box flex="1">
      <Text alignSelf="center" mt="4">
        長押しで並べ替え
      </Text>
      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        onDragEnd={({ data: _data }) => {
          setData(_data);
          tabOrderVar(_data);
          changedTabOrderVar(true);
        }}
      />
    </Box>
  );
};

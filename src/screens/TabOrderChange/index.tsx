import React, { useLayoutEffect, useCallback, useState } from 'react';
import { Box, Pressable, Text, Divider } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';

const initialData = [
  {
    id: 1,
    name: 'ビジネス',
  },
  {
    id: 2,
    name: '政治',
  },
  {
    id: 3,
    name: '金融経済',
  },
  {
    id: 4,
    name: '社会',
  },
  {
    id: 5,
    name: 'フォロー',
  },
];

type Props = RootNavigationScreenProp<'TabOrderChange'>;

export const TabOrderChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '順番の並び替え',
    });
  }, [navigation]);

  const [data, setData] = useState(initialData);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<typeof data[number]>) => {
      return (
        <>
          <ScaleDecorator>
            <Pressable onLongPress={drag} disabled={isActive} py="4" px="6">
              <Text fontWeight="bold">{item.name}</Text>
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
      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onDragEnd={({ data }) => setData(data)}
      />
    </Box>
  );
};

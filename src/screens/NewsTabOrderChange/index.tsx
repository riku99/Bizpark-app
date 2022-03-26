import React, { useLayoutEffect, useCallback, useState } from 'react';
import { Box, Pressable, Text, Divider } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import { CloseButton } from 'src/components/BackButon';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useNewsTabOrder } from 'src/hooks/newsTabOrder';

type Props = RootNavigationScreenProp<'NewsTabOrderChange'>;

export const NewsTabOrderChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '順番の並び替え',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const { newsTabOrder, setNewsTabOrder, setChangedNewsTabOrder } =
    useNewsTabOrder();

  const [data, setData] = useState(newsTabOrder);

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
          setNewsTabOrder(_data);
          setChangedNewsTabOrder(true);
        }}
      />
    </Box>
  );
};

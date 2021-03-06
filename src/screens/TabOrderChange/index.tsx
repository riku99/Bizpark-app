import React, { useLayoutEffect, useCallback, useState } from 'react';
import { Box, Pressable, Text, Divider } from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useTabOrder } from 'src/hooks/tabOrder';
import { CloseButton } from 'src/components/BackButon';

type Props = RootNavigationScreenProp<'TabOrderChange'>;

export const TabOrderChangeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: '順番の並び替え',
      headerRight: () => <CloseButton />,
    });
  }, [navigation]);

  const { tabOrder, setTabOrder, setChangedTabOrder } = useTabOrder();

  const [data, setData] = useState(tabOrder);

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
          setTabOrder(_data);
          setChangedTabOrder(true);
        }}
      />
    </Box>
  );
};

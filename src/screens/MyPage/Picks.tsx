import React, { useState } from 'react';
import { Button } from 'native-base';
import { PickedThoughts } from './PickedThoughts';
import { PickedNews } from './PickedNews';
import { MenuView, MenuAction } from '@react-native-menu/menu';

export const Picks = React.memo(() => {
  const [displayedCategory, setDisplayedCategory] = useState<
    'thought' | 'news'
  >('thought');

  const menuAction: MenuAction[] = [
    {
      id: 'news',
      title: 'ニュース',
      image: 'newspaper',
      state: displayedCategory === 'news' ? 'on' : undefined,
    },
    {
      id: 'thought',
      title: 'シェア',
      image: 'note.text',
      state: displayedCategory === 'thought' ? 'on' : undefined,
    },
  ];

  const onMenuAction = (id: string) => {
    if (id === 'thought') {
      setDisplayedCategory('thought');
      return;
    }

    if (id === 'news') {
      setDisplayedCategory('news');
      return;
    }
  };

  return (
    <>
      {displayedCategory === 'thought' ? <PickedThoughts /> : <PickedNews />}

      <MenuView
        actions={menuAction}
        style={{
          position: 'absolute',
          right: 22,
          bottom: 20,
        }}
        onPressAction={({ nativeEvent }) => {
          onMenuAction(nativeEvent.event);
        }}
      >
        <Button
          borderRadius="3xl"
          w="24"
          h="10"
          zIndex={30}
          _text={{
            fontSize: 14,
          }}
        >
          切り替え
        </Button>
      </MenuView>
    </>
  );
});

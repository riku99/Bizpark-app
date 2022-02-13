import React from 'react';
import { MenuView, MenuAction } from '@react-native-menu/menu';

type ID = 'delete';

type Props = {
  children: JSX.Element;
  onAction: (id: ID) => void;
  isMyItem: boolean;
};

export const Menu = ({ children, onAction, isMyItem }: Props) => {
  const baseAction = [];

  const myItemAction = [
    {
      id: 'delete',
      title: '削除',
      attributes: {
        destructive: true,
      },
      image: 'trash',
      imageColor: 'red',
    },
  ];

  const menuAction: MenuAction[] = isMyItem ? myItemAction : baseAction;

  return (
    <MenuView
      actions={menuAction}
      onPressAction={(e) => {
        onAction(e.nativeEvent.event as ID);
      }}
    >
      {children}
    </MenuView>
  );
};

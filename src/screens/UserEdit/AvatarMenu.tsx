import React from 'react';
import { MenuView, MenuAction } from '@react-native-menu/menu';

type ActionID = 'select' | 'delete';
type Props = {
  children: JSX.Element;
  onAction: (id: string) => void;
};

export const AvatarMenu = ({ children, onAction }: Props) => {
  const menuAction: MenuAction[] = [
    {
      id: 'select',
      title: '写真から選択',
      image: 'photo',
    },
    {
      id: 'delete',
      title: 'プロフィール画像を削除',
      attributes: {
        destructive: true,
      },
      image: 'trash',
      imageColor: 'red',
    },
  ];

  return (
    <MenuView
      actions={menuAction}
      onPressAction={(e) => {
        onAction(e.nativeEvent.event);
      }}
    >
      {children}
    </MenuView>
  );
};

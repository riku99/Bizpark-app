import { MenuAction, MenuView } from '@react-native-menu/menu';
import React from 'react';

type AcionsIds = 'delete' | 'block' | 'report';

type Props = {
  children: JSX.Element;
  onAction: (id: AcionsIds) => void;
  isMyItem: boolean;
};

export const Menu = ({ children, onAction, isMyItem }: Props) => {
  const otherUserAction = [
    {
      id: 'block',
      title: 'このユーザーをブロック',
      image: 'nosign',
    },
    {
      id: 'report',
      title: 'この投稿を報告',
      image: 'flag',
    },
  ];

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

  const menuAction: MenuAction[] = isMyItem ? myItemAction : otherUserAction;

  return (
    <MenuView
      actions={menuAction}
      onPressAction={(e) => {
        onAction(e.nativeEvent.event as AcionsIds);
      }}
    >
      {children}
    </MenuView>
  );
};

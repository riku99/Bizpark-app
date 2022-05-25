import { MenuAction, MenuView } from '@react-native-menu/menu';
import React from 'react';
import { Genre } from 'src/generated/graphql';

type Props = {
  children: JSX.Element;
  onAction: (id: Genre) => void;
};

const menuAction: MenuAction[] = [
  {
    id: Genre.Business,
    title: 'ビジネス👨‍💻\n(仕事, 最新ビジネス etc...)',
  },
  {
    id: Genre.Politics,
    title: '政治💴\n(政治, 国際政治, 選挙 etc...)',
  },
  {
    id: Genre.Economy,
    title: '金融・経済💹\n(経済, 金融, 株 etc...)',
  },
  {
    id: Genre.Society,
    title: '社会🙋‍♂️🙋‍♀️\n(社会問題, 環境, etc...)',
  },
];

export const GenreMenu = ({ children, onAction }: Props) => {
  return (
    <MenuView
      actions={menuAction}
      onPressAction={(e) => {
        onAction(e.nativeEvent.event as Genre);
      }}
    >
      {children}
    </MenuView>
  );
};

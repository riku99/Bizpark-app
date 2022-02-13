import React from 'react';
import { MenuView, MenuAction } from '@react-native-menu/menu';
import { Genre } from 'src/generated/graphql';

type Props = {
  children: JSX.Element;
  onAction: (id: Genre) => void;
};

const menuAction: MenuAction[] = [
  {
    id: Genre.Business,
    title: 'Busines👨‍💻\n(仕事, 最新ビジネス etc...)',
  },
  {
    id: Genre.Politics,
    title: 'Politics💴\n(政治, 国際政治, 選挙 etc...)',
  },
  {
    id: Genre.Economy,
    title: 'Economy💹\n(経済, 金融, 株 etc...)',
  },
  {
    id: Genre.Society,
    title: 'Society🙋‍♂️🙋‍♀️\n(社会問題, 環境, etc...)',
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

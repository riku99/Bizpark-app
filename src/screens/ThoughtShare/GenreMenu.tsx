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
    title: 'γγΈγγΉπ¨βπ»\n(δ»δΊ, ζζ°γγΈγγΉ etc...)',
  },
  {
    id: Genre.Politics,
    title: 'ζΏζ²»π΄\n(ζΏζ²», ε½ιζΏζ²», ιΈζ etc...)',
  },
  {
    id: Genre.Economy,
    title: 'ιθγ»η΅ζΈπΉ\n(η΅ζΈ, ιθ, ζ ͺ etc...)',
  },
  {
    id: Genre.Society,
    title: 'η€ΎδΌπββοΈπββοΈ\n(η€ΎδΌει‘, η°ε’, etc...)',
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

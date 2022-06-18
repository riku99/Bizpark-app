import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

export const Section = ({ title, children }: Props) => {
  return (
    <View style={styles.sectoin}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectoin: {
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

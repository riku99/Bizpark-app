import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  part: number;
  children: JSX.Element | JSX.Element[];
};

export const SectionPart = ({ part, children }: Props) => {
  return (
    <View style={styles.part}>
      <Text style={styles.textCommon}>{part}.</Text>
      <View style={styles.mainTextArea}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  part: {
    flexDirection: 'row',
    marginTop: 10,
  },
  textCommon: {
    fontSize: 15,
    lineHeight: 20,
  },
  mainTextArea: {
    paddingHorizontal: 12,
  },
});

import React, { useLayoutEffect } from 'react';
import {
  Box,
  ScrollView,
  Text,
  HStack,
  useTheme,
  VStack,
  Button,
} from 'native-base';
import { RootNavigationScreenProp } from 'src/types';
import LottieView from 'lottie-react-native';
import { Entypo } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Rocket = require('../../assets/lottie/rocket.json');

type Props = RootNavigationScreenProp<'IAP'>;

const possibleList = [
  '他のユーザーをフォローできる',
  'ユーザー個人にメッセージを送ることができる',
  '参加できるトークの数が無制限',
];

export const IAPScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();

  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'プラン変更',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTitleStyle: {
        color: 'black',
      },
      headerTintColor: 'black',
    });
  }, [navigation]);

  return (
    <>
      <ScrollView
        flex="1"
        bg="white"
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <LottieView
          source={Rocket}
          autoPlay
          loop
          style={{
            width: 120,
          }}
        />
        <Text color="textBlack" fontWeight="bold" mt="4" fontSize="21">
          {'プラスプランにアップグレードして\nより充実させよう'}
        </Text>

        <Box
          mt="8"
          w="full"
          px="4"
          py="8"
          borderWidth="0.5"
          borderColor="lightGray"
          borderRadius="lg"
        >
          <Text
            color="textBlack"
            alignSelf="center"
            borderWidth="0.5"
            borderColor="lightGray"
            borderRadius="xl"
            bg="white"
            px="2"
            position="absolute"
            style={{
              transform: [{ translateY: -10 }],
            }}
          >
            できるようになること
          </Text>

          <VStack space="4">
            {possibleList.map((l, idx) => {
              return (
                <HStack key={idx}>
                  <Entypo name="check" size={26} color={colors.pink} />
                  <Text
                    color="textBlack"
                    ml="2"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    {l}
                  </Text>
                </HStack>
              );
            })}
          </VStack>
        </Box>
      </ScrollView>
      <Button
        w="95%"
        _text={{
          fontSize: 18,
        }}
        position="absolute"
        bottom="0"
        borderRadius="lg"
        alignSelf="center"
        style={{
          bottom: safeAreaBottom + 10,
        }}
        h="12"
      >
        ￥400/月でアップグレード
      </Button>
    </>
  );
};

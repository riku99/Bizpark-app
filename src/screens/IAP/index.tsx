import React, { useLayoutEffect, useEffect, useState } from 'react';
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
import { StyleSheet } from 'react-native';
import { useIap } from 'src/hooks/iap';
import * as InAppPurchases from 'expo-in-app-purchases';
import Config from 'react-native-config';
import { MotiView } from 'moti';
import { useSpinner } from 'src/hooks/spinner';
import { useIsPlusPlan } from 'src/hooks/me';
import { Alert } from 'react-native';

const Rocket = require('../../assets/lottie/rocket.json');

type Props = RootNavigationScreenProp<'IAP'>;

const possibleList = [
  '他のユーザーをフォローできる',
  'ユーザー個人にメッセージを送ることができる',
  '参加できるトークの数が無制限',
];

const alertText = [
  'アップグレード日から1ヶ月後に自動更新されます。',
  '課金の継続はお客様自身で管理することができます。',
  '定期購入のキャンセルはお使いの端末の設定から行ってください。',
  '内容は変更される可能性がございます。',
];

export const IAPScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const isPlusPlan = useIsPlusPlan();
  const [isPurcahceProcessing, setIsPurcahceProcessing] = useState(false);

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

  useEffect(() => {
    if (isPlusPlan) {
      if (isPurcahceProcessing) {
        Alert.alert('プラスプランに切り替わりました', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              setIsPurcahceProcessing(false);
            },
          },
        ]);
      } else {
        Alert.alert('既にプラスプランです', '', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    }
  }, [isPlusPlan, isPurcahceProcessing, navigation]);

  const { getProducts } = useIap();

  const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>();

  const month =
    products && products[0].priceCurrencyCode === 'USD' ? 'Month' : '月';

  useEffect(() => {
    (async () => {
      const _products = await getProducts();
      setProducts(_products);
    })();
  }, [getProducts]);

  const { setSpinnerVisible } = useSpinner();

  const onPurchaceButtonPress = async () => {
    setSpinnerVisible(true);
    setIsPurcahceProcessing(true);
    await InAppPurchases.purchaseItemAsync(Config.IAP_PLUS_PLAN);
  };

  return (
    <>
      <ScrollView
        flex="1"
        bg="white"
        contentContainerStyle={styles.contentContainer}
      >
        <LottieView source={Rocket} autoPlay loop style={styles.rocket} />
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

        <Box w="100%" mt="8">
          <Text color="textBlack" fontWeight="bold">
            注意事項
          </Text>

          <VStack px="2" space="2" mt="2">
            {alertText.map((text, idx) => {
              return (
                <HStack key={idx}>
                  <Text color="textBlack">・</Text>
                  <Text color="textBlack" fontSize="12">
                    {text}
                  </Text>
                </HStack>
              );
            })}
          </VStack>
        </Box>
      </ScrollView>

      {products?.length && (
        <MotiView
          from={{
            translateY: 180,
          }}
          animate={{ translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 500,
          }}
        >
          <Box
            bg="white"
            h="16"
            position="absolute"
            bottom="0"
            w="100%"
            alignItems="center"
            justifyContent="center"
            style={{
              bottom: safeAreaBottom,
            }}
          >
            <Button
              w="95%"
              _text={{
                fontSize: 18,
              }}
              borderRadius="lg"
              h="12"
              onPress={onPurchaceButtonPress}
            >
              {`${products[0].price} / ${month}でアップグレード`}
            </Button>
          </Box>
        </MotiView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  rocket: {
    width: 120,
  },
});

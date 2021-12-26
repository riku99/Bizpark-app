import React, { useLayoutEffect, useState } from "react";
import {
  Box,
  VStack,
  Center,
  Button,
  useColorMode,
  Text,
  Flex,
} from "native-base";
import { RootNavigationProp } from "types";
import { Bg } from "src/components/Bg";
import { Image } from "react-native-expo-image-cache";
import AnimatedCheckbox from "react-native-checkbox-reanimated";
import { Pressable } from "react-native";

type Props = RootNavigationProp<"Tab">;

export const HomeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
      headerLeft: () => <Text>Logo</Text>,
    });
  }, [navigation]);

  const { toggleColorMode } = useColorMode();

  const [checked, setChecked] = useState(false);
  const onCheckPress = () => {
    setChecked((c) => !c);
  };

  return (
    <Bg flex={1}>
      <VStack px={4}>
        <Box bg="warmGray.800" borderRadius="lg" py={14} px={4}>
          <Flex direction="row" alignItems="center">
            <Image
              uri={uri}
              style={{ height: 34, width: 34, borderRadius: 34 }}
            />
            <Text fontWeight="bold" ml={2}>
              Riku
            </Text>
          </Flex>
          <Text fontSize={16} fontWeight="bold" mt={2}>
            キーエンスの強みを短く雑に
          </Text>
          <Text h={20}>{text}</Text>
          <Flex mt={2} direction="row" alignItems="center">
            <Text color="pink" fontWeight="bold" fontSize={16}>
              Pick
            </Text>
            <Pressable
              onPress={onCheckPress}
              style={{ width: 30, height: 30, marginLeft: 4 }}
            >
              <AnimatedCheckbox
                checked={checked}
                highlightColor="#4444ff"
                checkmarkColor="#ffffff"
                boxOutlineColor="#4444ff"
              />
            </Pressable>
          </Flex>
        </Box>
      </VStack>
      <Button
        position="absolute"
        w={50}
        h={30}
        bottom={30}
        onPress={toggleColorMode}
      >
        toggle
      </Button>
    </Bg>
  );
};

const uri =
  "https://scontent-nrt1-1.cdninstagram.com/v/t51.2885-15/e35/269868747_906015456777166_2060572380965546765_n.jpg?_nc_ht=scontent-nrt1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=-6oIGf2294IAX8VBWvP&tn=IvOg5e0MTmVxXJmw&edm=AIQHJ4wBAAAA&ccb=7-4&ig_cache_key=MjczNjQ0NTkxNDc5OTM4NDE0Nw%3D%3D.2-ccb7-4&oh=00_AT8dSS2oIRcdbf3nJoIxbbdHJDlWhJLYJXrWLnc_LAuCqA&oe=61CFCB43&_nc_sid=7b02f1";

const text =
  "大小に関わらず、判断には必ずベネフィットとコストが発生する。例えばキーエンスは直販モデルであり、代理店を使って全国に展開しているほかのメーカーと比べて商品を幅広く売るには非効率に見える。ただ、直販モデルにすることで得られるベネフィットも必ずある。代理店を挟む形だと「顧客からの要望」がメーカー側に伝わりにくい。代理店は売ることが仕事であり、商品を良くすることが仕事ではないからだ。わざわざメーカー側に要望するインセンティブが少ない。対して直販の場合は営業マンは要望の伝達も仕事のうちであり、もはや報告を強制されている可能性もあるだろう。なので顧客の要望を確実に拾うことができ、それが商品力のアップに繋がる。";
const data = [
  {
    id: 1,
    title: "キーエンスの強みのこと",
    text: "diehfduerhfiruefgiqefiier",
    contributer: {
      id: "deodjw",
      name: "Riku",
    },
  },
  {
    id: 2,
    title: "スシローの戦略",
    text: "dmkぇwんdjんdfんfkれbfれbqふぇりqbfrbfりbふぃrqfbvqrb",
    contributer: {
      id: "dedw",
      name: "You",
    },
  },
];

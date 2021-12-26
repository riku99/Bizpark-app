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
import { useLayoutEffect } from "react";
import { Bg } from "src/components/Bg";
import { Image } from "react-native-expo-image-cache";

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

  return (
    <Bg flex={1}>
      <VStack px={4}>
        <Box bg="blueGray.600" borderRadius="3xl" py={14} px={4}>
          <Flex direction="row" alignItems="center">
            <Image
              uri={uri}
              style={{ height: 34, width: 34, borderRadius: 34 }}
            />
            <Text fontWeight="bold" ml={2}>
              Riku
            </Text>
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

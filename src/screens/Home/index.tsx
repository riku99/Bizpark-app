import { Box, VStack, Center } from "native-base";
import { RootNavigationProp } from "types";
import { useLayoutEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { Bg } from "src/components/Bg";

type Props = RootNavigationProp<"Tab">;

export const HomeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Bg flex={1}>
      {/* <VStack flex={1} space={10} alignItems="center">
        <Box w="50" h="30" bg="primary.900" />
        <Center w="64" h="20" bg="primary.500" rounded="md" shadow={3}>
          <Text>auto center</Text>
        </Center>
      </VStack> */}
    </Bg>
  );
};

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

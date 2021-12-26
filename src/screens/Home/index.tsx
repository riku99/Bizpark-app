import { Box, VStack, Center, Button, useColorMode } from "native-base";
import { RootNavigationProp } from "types";
import { useLayoutEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { Bg } from "src/components/Bg";

type Props = RootNavigationProp<"Tab">;

export const HomeScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShadowVisible: false,
      headerTitle: "",
    });
  }, [navigation]);

  const { toggleColorMode } = useColorMode();

  return (
    <Bg flex={1}>
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

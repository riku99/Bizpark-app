import React, { useLayoutEffect, useState } from "react";
import { RootNavigationScreenProp } from "src/types";
import { WebView } from "react-native-webview";
import { useNewsCacheFragment } from "src/hooks/apollo";
import { SafeAreaView, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Box, Button } from "native-base";
import { CloseButton } from "src/components/CloseButton";

type Props = RootNavigationScreenProp<"NewsWebView">;

export const NewsWebViewScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, []);

  const { readNewsFragment } = useNewsCacheFragment();
  const data = readNewsFragment({ id });
  const [talkButtonVisible, setTalkButtonVisible] = useState(true);

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: data.link }}
        style={{ width: "100%", height: "100%" }}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={false}
        mediaPlaybackRequiresUserAction={true}
        cacheEnabled={true}
        incognito={true}
      />

      {talkButtonVisible && (
        <MotiView
          from={{ translateY: 180 }}
          animate={{ translateY: 0 }}
          transition={{ type: "timing", duration: 400 }}
        >
          <Box
            position="absolute"
            w="90%"
            alignItems="center"
            alignSelf="center"
            bottom={4}
          >
            <CloseButton
              size={7}
              style={styles.closeButton}
              onPress={() => {
                setTalkButtonVisible(false);
              }}
            />
            <Button w="100%" _text={{ fontSize: 16 }}>
              このニュースについてトークする
            </Button>
          </Box>
        </MotiView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: "flex-end",
    transform: [{ translateY: -15 }],
  },
});

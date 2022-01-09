import React, { useLayoutEffect } from "react";
import { RootNavigationScreenProp } from "src/types";
import { WebView } from "react-native-webview";
import { useNewsCacheFragment } from "src/hooks/apollo";
import { SafeAreaView } from "react-native";
import { MotiView } from "moti";
import { Box, Button } from "native-base";

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

      <MotiView
        from={{ translateY: 180 }}
        animate={{ translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
      >
        <Box position="absolute" w="100%" alignItems="center" bottom={4}>
          <Button w="90%" _text={{ fontSize: 16 }}>
            トークする
          </Button>
        </Box>
      </MotiView>
    </SafeAreaView>
  );
};

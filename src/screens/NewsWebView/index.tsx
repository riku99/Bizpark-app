import React, { useLayoutEffect, useState } from "react";
import { RootNavigationScreenProp } from "src/types";
import { WebView } from "react-native-webview";
import { useNewsCacheFragment } from "src/hooks/apollo";
import { SafeAreaView, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { JoinTalkButton } from "./JoinTalkButton";

type Props = RootNavigationScreenProp<"NewsWebView">;

export const NewsWebViewScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, []);

  // こことかクエリにできる(?)
  const { readNewsFragment } = useNewsCacheFragment();
  const data = readNewsFragment({ id });
  const [talkButtonVisible, setTalkButtonVisible] = useState(true);

  const onJoinTalkRoomCloseButtonPress = () => {
    setTalkButtonVisible(false);
  };

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
          <JoinTalkButton
            onCloseButtonPress={onJoinTalkRoomCloseButtonPress}
            newsId={id}
          />
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

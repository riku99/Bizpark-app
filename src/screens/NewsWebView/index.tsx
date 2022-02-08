import React, { useLayoutEffect, useState, useEffect } from "react";
import { RootNavigationScreenProp } from "src/types";
import { WebView } from "react-native-webview";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { MotiView } from "moti";
import { JoinTalkButton } from "./JoinTalkButton";
import { useGetOneNewsQuery } from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";

type Props = RootNavigationScreenProp<"NewsWebView">;

export const NewsWebViewScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, []);

  const [talkButtonVisible, setTalkButtonVisible] = useState(true);

  const onJoinTalkRoomCloseButtonPress = () => {
    setTalkButtonVisible(false);
  };

  const { data: newsData, error } = useGetOneNewsQuery({
    variables: {
      id,
    },
  });

  useEffect(() => {
    if (error) {
      Alert.alert("ニュースが見つかりませんでした", "", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }
  }, [error]);

  if (!newsData) {
    return (
      <Indicator
        style={{ alignSelf: "center", marginTop: "55%" }}
        size="large"
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: newsData.oneNews.link }}
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

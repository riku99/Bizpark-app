import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, useColorModeValue, useTheme } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useUserCacheFragment } from "src/hooks/users";
import { useUserQuery, useBlockMutation } from "src/generated/graphql";
import { SocialIconProps } from "react-native-elements";
import { Profile } from "src/components/Profile";
import { RefreshControl } from "src/components/RefreshControl";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { InstaLikeModal } from "src/components/InstaLikeModal";
import { useToast } from "react-native-toast-notifications";
import { Alert } from "react-native";

type Props = RootNavigationScreenProp<"UserProfile">;

// MyPageで表示するプロフィール以外のプロフィール画面
export const UserProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;
  const { readUserFragment } = useUserCacheFragment();
  const cacheData = readUserFragment({ id });
  const { refetch, data } = useUserQuery({
    variables: {
      id,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();
  const [blockMutation] = useBlockMutation();
  const toast = useToast();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: cacheData ? cacheData.name : "ユーザーが存在しません",
      headerRight: cacheData
        ? () => (
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color={useColorModeValue(colors.textBlack, colors.textWhite)}
              onPress={() => {
                setModalVisible(true);
              }}
            />
          )
        : undefined,
    });
  }, [cacheData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!cacheData) {
    return null;
  }

  const {
    name,
    imageUrl,
    bio,
    instagram,
    facebook,
    twitter,
    linkedin,
    follow,
    blocking,
  } = cacheData;
  const socials: { type: SocialIconProps["type"]; value: string | null }[] = [
    { type: "facebook", value: facebook },
    { type: "twitter", value: twitter },
    { type: "linkedin", value: linkedin },
    { type: "instagram", value: instagram },
  ];

  const modalList = [
    {
      title: blocking ? "ブロック解除" : "ブロックする",
      color: "#f51000",
      onPress: async () => {
        if (id) {
          try {
            Alert.alert(
              "ブロックしますか?",
              "シェアが表示されなくなり、フォローも解除されます",
              [
                {
                  text: "キャンセル",
                  style: "cancel",
                },
                {
                  text: "ブロックする",
                  style: "destructive",
                  onPress: async () => {
                    await blockMutation({
                      variables: {
                        blockTo: id,
                      },
                    });

                    toast.show("ブロックしました", { type: "success" });
                  },
                },
              ]
            );
          } catch (e) {
          } finally {
            setModalVisible(false);
          }
        }
      },
    },
    {
      title: "メッセージを送る",
      onPress: async () => {},
    },
  ];

  return (
    <>
      <ScrollView
        flex={1}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 50,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Profile
          id={id}
          name={name}
          bio={bio}
          imageUrl={imageUrl}
          socials={socials}
          follow={follow}
        />
      </ScrollView>

      <InstaLikeModal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onCancel={closeModal}
        list={modalList}
      />
    </>
  );
};

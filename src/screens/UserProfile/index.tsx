import React, { useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, useColorModeValue, useTheme } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import { useUserCacheFragment } from "src/hooks/users";
import {
  useUserQuery,
  useMeQuery,
  UserProfileFragment,
  UserProfileFragmentDoc,
} from "src/generated/graphql";
import { SocialIconProps } from "react-native-elements";
import { Profile } from "src/components/Profile";
import { RefreshControl } from "src/components/RefreshControl";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { InstaLikeModal } from "src/components/InstaLikeModal";
import { useToast } from "react-native-toast-notifications";
import { Alert } from "react-native";
import { useUnblock, useBlock } from "src/hooks/users";
import { useApolloClient, gql } from "@apollo/client";
import { Indicator } from "src/components/Indicator";

type Props = RootNavigationScreenProp<"UserProfile">;

// MyPageで表示するプロフィール以外のプロフィール画面
export const UserProfileScreen = ({ navigation, route }: Props) => {
  const { id } = route.params;

  const { cache } = useApolloClient();

  const cacheData = cache.readFragment<UserProfileFragment>({
    id: cache.identify({
      __typename: "User",
      id,
    }),
    fragment: UserProfileFragmentDoc,
  });

  const { refetch, data, loading } = useUserQuery({
    variables: {
      id,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const [blockMutation] = useBlock();
  const [unblockMutation] = useUnblock();

  const toast = useToast();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);

  const {
    data: { me },
  } = useMeQuery();

  const isMe = me.id === id;

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        !data && !loading
          ? "ユーザーが存在しません"
          : data?.user.name ?? cacheData.name,
      headerRight:
        (cacheData || data) && !isMe
          ? () => (
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color={iconColor}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            )
          : undefined,
    });
  }, [iconColor, isMe, loading, cacheData, data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!data && !cacheData) {
    if (loading) {
      return <Indicator style={{ marginTop: 10 }} />;
    } else {
      return null;
    }
  }

  const userProfile = data ? data.user : cacheData;

  const {
    name,
    imageUrl,
    bio,
    instagram,
    facebook,
    twitter,
    linkedin,
  } = userProfile;
  const socials: { type: SocialIconProps["type"]; value: string | null }[] = [
    { type: "facebook", value: facebook },
    { type: "twitter", value: twitter },
    { type: "linkedin", value: linkedin },
    { type: "instagram", value: instagram },
  ];

  const modalList = [
    {
      title: data?.user.blocking ? "ブロック解除" : "ブロックする",
      color: "#f51000",
      onPress: async () => {
        if (id && data) {
          try {
            if (!data?.user.blocking) {
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
                      try {
                        await blockMutation({
                          variables: {
                            blockTo: id,
                          },
                        });

                        toast.show("ブロックしました", { type: "success" });
                      } catch (e) {}
                    },
                  },
                ]
              );
            } else {
              Alert.alert(
                "ブロック解除しますか?",
                "シェアが表示されるようになり、フォローも可能になります",
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "解除する",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await unblockMutation({
                          variables: {
                            blockedUserId: id,
                          },
                        });

                        toast.show("解除しました", { type: "success" });
                      } catch (e) {}
                    },
                  },
                ]
              );
            }
          } catch (e) {
          } finally {
            setModalVisible(false);
          }
        }
      },
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
          isMe={isMe}
          loading={loading}
          follow={data?.user.follow}
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

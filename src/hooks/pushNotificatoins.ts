import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import {
  PushNotificationFollowDataType,
  PushNotificationMessageDataType,
  useAddDeviceTokenMutation,
  useGetNewsTalkRoomLazyQuery,
  useGetOneOnOneTalkRoomLazyQuery,
  useGetThoughtTalkRoomLazyQuery,
} from 'src/generated/graphql';
import { mmkvStorageKeys, storage } from 'src/storage/mmkv';
import { PushNotificationData, RootNavigationProp } from 'src/types';

const DEVICE_TOKEN_STORAGE_KEY = 'DEVICE_TOKEN';

export const useDeviceToken = () => {
  const [addDeviceTokenMutation] = useAddDeviceTokenMutation();

  useEffect(() => {
    (async function () {
      const token = await messaging().getToken();

      const storageDeviceToken = await AsyncStorage.getItem(
        DEVICE_TOKEN_STORAGE_KEY
      );

      if (!storageDeviceToken || token !== storageDeviceToken) {
        try {
          await addDeviceTokenMutation({
            variables: {
              input: {
                newToken: token,
                oldToken: storageDeviceToken,
              },
            },
          });

          await AsyncStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
        } catch (e) {
          console.log(e);
        }
      }
    })();

    return messaging().onTokenRefresh((token) => {
      (async function () {
        const storageDeviceToken = await AsyncStorage.getItem(
          DEVICE_TOKEN_STORAGE_KEY
        );

        await addDeviceTokenMutation({
          variables: {
            input: {
              newToken: token,
              oldToken: storageDeviceToken,
            },
          },
        });

        await AsyncStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
      })();
    });
  }, [addDeviceTokenMutation]);
};

export const useFcmHandler = () => {
  const navigation = useNavigation<RootNavigationProp<any>>();

  const [getOneOnOneTalkRoomQuery] = useGetOneOnOneTalkRoomLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [getNewsTalkRoomQuery] = useGetNewsTalkRoomLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [getThoughtTalkRoomQuery] = useGetThoughtTalkRoomLazyQuery({
    fetchPolicy: 'network-only',
  });

  const onOpened = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const data = remoteMessage.data as PushNotificationData;

      if (
        data.type === PushNotificationMessageDataType.OneOnOneTalkRoomMessage
      ) {
        const talkRoomId = Number(data.roomId);

        navigation.navigate('OneOnOneTalkRoom', {
          screen: 'OneOnOneTalkRoomMain',
          params: {
            id: talkRoomId,
          },
        });

        await getOneOnOneTalkRoomQuery({
          variables: {
            id: talkRoomId,
          },
        });

        return;
      }

      if (data.type === PushNotificationMessageDataType.NewsTalkRoomMessage) {
        const talkRoomId = Number(data.roomId);

        navigation.navigate('NewsTalkRoom', {
          screen: 'NewsTalkRoomMain',
          params: {
            id: talkRoomId,
          },
        });

        await getNewsTalkRoomQuery({
          variables: {
            id: talkRoomId,
          },
        });

        return;
      }

      if (
        data.type === PushNotificationMessageDataType.ThoughtTalkRoomMessage
      ) {
        const talkRoomId = Number(data.roomId);

        navigation.navigate('ThoughtTalkRoom', {
          screen: 'ThoughtTalkRoomMain',
          params: {
            id: talkRoomId,
          },
        });

        await getThoughtTalkRoomQuery({
          variables: {
            id: talkRoomId,
          },
        });

        return;
      }

      if (data.type === PushNotificationFollowDataType.Follow) {
        navigation.navigate('UserProfile', {
          id: data.userId,
        });
        return;
      }
    },
    [
      navigation,
      getNewsTalkRoomQuery,
      getOneOnOneTalkRoomQuery,
      getThoughtTalkRoomQuery,
    ]
  );

  useEffect(() => {
    const unsbscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      onOpened(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          storage.set(
            mmkvStorageKeys.pushNotificationWhenKilled,
            JSON.stringify(remoteMessage)
          );
        }
      });

    return unsbscribe;
  }, [onOpened]);
};

export const useCheckFcmWhenKilled = () => {
  const navigation = useNavigation<RootNavigationProp<any>>();

  useEffect(() => {
    const remoteMessageStr = storage.getString(
      mmkvStorageKeys.pushNotificationWhenKilled
    );

    if (remoteMessageStr) {
      storage.delete(mmkvStorageKeys.pushNotificationWhenKilled);

      const remoteMessage = JSON.parse(
        remoteMessageStr
      ) as FirebaseMessagingTypes.RemoteMessage;

      const data = remoteMessage.data as PushNotificationData;

      if (data) {
        if (
          data.type === PushNotificationMessageDataType.OneOnOneTalkRoomMessage
        ) {
          const talkRoomId = Number(data.roomId);

          navigation.navigate('OneOnOneTalkRoom', {
            screen: 'OneOnOneTalkRoomMain',
            params: {
              id: talkRoomId,
            },
          });
        } else if (
          data.type === PushNotificationMessageDataType.NewsTalkRoomMessage
        ) {
          const talkRoomId = Number(data.roomId);

          navigation.navigate('NewsTalkRoom', {
            screen: 'NewsTalkRoomMain',
            params: {
              id: talkRoomId,
            },
          });
        } else if (
          data.type === PushNotificationMessageDataType.ThoughtTalkRoomMessage
        ) {
          const talkRoomId = Number(data.roomId);

          navigation.navigate('ThoughtTalkRoom', {
            screen: 'ThoughtTalkRoomMain',
            params: {
              id: talkRoomId,
            },
          });
        } else if (data.type === PushNotificationFollowDataType.Follow) {
          navigation.navigate('UserProfile', {
            id: data.userId,
          });
        }
      }
    }
  }, [navigation]);
};

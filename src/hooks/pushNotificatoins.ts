import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useAddDeviceTokenMutation,
  PushNotificationDataKind,
  useGetOneOnOneTalkRoomLazyQuery,
} from 'src/generated/graphql';
import { PushNotificationData, RootNavigationProp } from 'src/types';
import { useNavigation } from '@react-navigation/native';

const DEVICE_TOKEN_STORAGE_KEY = 'DEVICE_TOKEN';

export const useDeviceToken = () => {
  const [addDeviceTokenMutation] = useAddDeviceTokenMutation();

  useEffect(() => {
    (async function () {
      const token = await messaging().getToken();

      const storageDeviceToken = await AsyncStorage.getItem(
        DEVICE_TOKEN_STORAGE_KEY
      );

      if (true) {
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

  const [getOneOnOneTalkRoomQuery] = useGetOneOnOneTalkRoomLazyQuery();

  const onOpened = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const data = remoteMessage.data as PushNotificationData;
      if (data.type === PushNotificationDataKind.OneOnOneTalkRoomMessage) {
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
      }
    },
    [navigation]
  );

  useEffect(() => {
    const unsbscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      onOpened(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          onOpened(remoteMessage);
        }
      });

    return unsbscribe;
  }, [onOpened]);
};

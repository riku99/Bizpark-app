import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAddDeviceTokenMutation } from 'src/generated/graphql';

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
  }, [addDeviceTokenMutation]);
};

import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loggedIn = makeVar<boolean>(false);

export const meVar = {
  loggedIn,
};

export const storageKeys = {
  loggedIn: 'LOGGED_IN',
};

export const getMeStorageData = async () => {
  const storageLoggedin = await AsyncStorage.getItem(storageKeys.loggedIn);

  return {
    storageLoggedin,
  };
};

import { makeVar } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loggedIn = makeVar<boolean>(false);
const checkedStorage = makeVar(false);

export const meVar = {
  loggedIn,
  checkedStorage,
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

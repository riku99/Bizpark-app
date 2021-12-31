import { makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loggedIn = makeVar<boolean>(false);
export const id = makeVar<string | null>(null);
export const name = makeVar<string | null>(null);

export const meVar = {
  loggedIn,
  id,
  name,
};

export const storageKeys = {
  loggedIn: "LOGGED_IN",
  id: "ID",
  name: "NAME",
};

export const getMeStorageData = async () => {
  const storageLoggedin = await AsyncStorage.getItem(storageKeys.loggedIn);
  const storageId = await AsyncStorage.getItem(storageKeys.id);
  const storageName = await AsyncStorage.getItem(storageKeys.name);

  return {
    storageLoggedin,
    storageId,
    storageName,
  };
};

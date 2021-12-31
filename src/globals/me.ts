import { makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "src/generated/graphql";

type MeVar = {
  loggedIn: boolean;
} & User;

export const loggedIn = makeVar<boolean>(false);
export const id = makeVar<string | null>(null);
export const name = makeVar<string | null>(null);
export const bio = makeVar<string | null>(null);
export const imageUrl = makeVar<string | null>(null);

export const meVar = {
  loggedIn,
  id,
  name,
  bio,
  imageUrl,
};

export const setMeVar = ({
  loggedIn,
  id,
  name,
  imageUrl,
  bio,
}: Partial<MeVar>) => {
  if (id !== undefined) {
    meVar.id(id);
  }

  if (name !== undefined) {
    meVar.name(name);
  }

  if (imageUrl !== undefined) {
    meVar.imageUrl(imageUrl);
  }

  if (bio !== undefined) {
    meVar.bio(bio);
  }

  if (loggedIn !== undefined) {
    meVar.loggedIn(loggedIn);
  }
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

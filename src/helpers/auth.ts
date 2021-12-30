import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { meVar, storageKeys } from "src/globals/me";

export const signOut = async () => {
  await auth().signOut();

  meVar.loggedIn(false);
  meVar.id(null);
  meVar.name(null);

  await AsyncStorage.removeItem(storageKeys.id);
  await AsyncStorage.removeItem(storageKeys.name);
  await AsyncStorage.setItem(storageKeys.loggedIn, JSON.stringify(false));

  console.log("👋 Sign out success!");
};

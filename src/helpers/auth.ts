import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { meVar, storageKeys, setMeVar } from "src/stores/me";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const googleSignIn = async () => {
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const googleResult = await auth().signInWithCredential(googleCredential);
  const userIdToken = await googleResult.user.getIdToken();

  return userIdToken;
};

export const signOut = async () => {
  await auth().signOut();

  setMeVar({
    loggedIn: false,
    id: null,
    name: null,
    bio: null,
    imageUrl: null,
  });

  await AsyncStorage.removeItem(storageKeys.id);
  await AsyncStorage.removeItem(storageKeys.name);
  await AsyncStorage.setItem(storageKeys.loggedIn, JSON.stringify(false));

  console.log("👋 Sign out success!");
};

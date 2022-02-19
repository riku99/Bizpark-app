import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const googleSignIn = async () => {
  const { idToken } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const googleResult = await auth().signInWithCredential(googleCredential);
  const userIdToken = await googleResult.user.getIdToken();

  return {
    idToken: userIdToken,
    googleData: googleResult,
  };
};

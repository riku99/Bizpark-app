import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

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

export const appleSignIn = async () => {
  const appleAuthResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  if (!appleAuthResponse.identityToken) {
    Alert.alert('無効なアカウントです');
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  const { identityToken, nonce } = appleAuthResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce
  );

  const appleData = await auth().signInWithCredential(appleCredential);
  const idToken = await appleData.user.getIdToken();

  return {
    idToken,
    appleData,
    name: appleAuthResponse.fullName.givenName,
  };
};

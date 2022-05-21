import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const sendPasswordResetEmail = (email: string) => {
  Alert.alert(
    email,
    '上記のメールアドレスにパスワード変更用のメールを送ります。',
    [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '送る',
        onPress: async () => {
          try {
            await auth().sendPasswordResetEmail(email);
            Alert.alert('送信しました');
          } catch (e) {
            if (e.code === 'auth/user-not-found') {
              Alert.alert('メールアドレスが存在しません');
            } else {
              Alert.alert('送信に失敗しました');
            }
          }
        },
      },
    ]
  );
};

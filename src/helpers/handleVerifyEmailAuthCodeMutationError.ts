import { ApolloError } from '@apollo/client';
import { Alert } from 'react-native';
import { VerifyEmailAuthCodeError } from 'src/generated/graphql';
import { getGraphQLError } from 'src/utils';

export const handleVerifyEmailAuthCodeMutationError = (errors: ApolloError) => {
  const e = getGraphQLError(errors, 0);
  if (e) {
    if (e.code === VerifyEmailAuthCodeError.Expired) {
      Alert.alert('有効期限が切れています');
      return;
    }

    if (e.code === VerifyEmailAuthCodeError.Invalid) {
      Alert.alert('コードが間違っています');
      return;
    }

    if (e.code === VerifyEmailAuthCodeError.NotFound) {
      Alert.alert(
        '認証コードが見つかりません',
        'お手数ですが初めからやり直してください。'
      );
      return;
    }
  }
};

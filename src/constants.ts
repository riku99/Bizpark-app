import { Dimensions } from 'react-native';
import { SocialIconProps } from 'react-native-elements';

const dimensions = Dimensions.get('screen');

export const HIGHER_8_DEVICE = dimensions.height > 667;

export const socialIcons: SocialIconProps['type'][] = [
  'facebook',
  'twitter',
  'linkedin',
  'instagram',
];

export const INSTAGRAM_BASE_URL = 'https://www.instagram.com';
export const TWITTER_BASE_URL = 'https://twitter.com';

export const NO_USER_IMAGE_URL =
  'https://storage.googleapis.com/bizpark-dev/no-user.png';

export const INITIAL_MESSAGE_COUNT = 20;

export const loginProviders = {
  google: 'Google',
  apple: 'Apple',
  mailAddress: 'メールアドレス',
};

export const ERROR_TOAST_DURATION = 2500
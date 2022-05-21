type PushNotificationData =
  import('../generated/graphql').PushNotificationMessage;

type ThoughtShare = {
  title?: string;
  text: string;
  images: { url: string; mime: string }[];
};

type Socials = 'facebook' | 'twitter' | 'linkedin' | 'instagram';

type TohughtStackParamList = {
  Thought: {
    id: string;
  };
  SharedImage: {
    item: {
      id: string;
      url: string;
    };
  };
};

type ThoughtNavigationScreenProps<T extends keyof TohughtStackParamList> =
  import('@react-navigation/native-stack').NativeStackScreenProps<
    TohughtStackParamList,
    T
  >;

type AllStackParamList = import('../navigations').RootStackParamList &
  import('../navigations/Main').MainStackParamList &
  import('../navigations/Auth').AuthStackParamList &
  import('../navigations/Settings').SettingsParamList &
  import('../navigations/ThoughtTalkRoom').ThoughtTalkRoomStackParamList &
  import('../navigations/NewsTalkRoom').NewsTalkRoomStackParamList &
  import('../navigations/OneOnOneTalkRoom').OneOnOneTalkRoomStackParamList &
  import('../navigations/Home').HomeStackParamList;

type RootNavigationScreenProp<T extends keyof AllStackParamList> =
  import('@react-navigation/native-stack').NativeStackScreenProps<
    AllStackParamList,
    T
  >;

type RootNavigationProp<T extends keyof AllStackParamList> =
  import('@react-navigation/native-stack').NativeStackNavigationProp<
    AllStackParamList,
    T
  >;

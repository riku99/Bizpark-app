import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { SettingsParamList } from 'src/navigations/Settings';
import { ThoughtTalkRoomStackParamList } from 'src/navigations/ThoughtTalkRoom';
import { NewsTalkRoomStackParamList } from 'src/navigations/NewsTalkRoom';
import { OneOnOneTalkRoomStackParamList } from 'src/navigations/OneOnOneTalkRoom';
import { PushNotificationMessage } from 'src/generated/graphql';

export type PushNotificationData = PushNotificationMessage;

type ThoughtShare = {
  title?: string;
  text: string;
  images: { url: string; mime: string }[];
};

export type Socials = 'facebook' | 'twitter' | 'linkedin' | 'instagram';

export type TohughtStackParamList = {
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

export type ThoughtNavigationScreenProps<
  T extends keyof TohughtStackParamList
> = NativeStackScreenProps<TohughtStackParamList, T>;

export type RootStackParamList = {
  Tab: undefined;
  Signup: undefined;
  Signin: undefined;
  MailForm: {
    type: 'signUp' | 'signIn';
  };
  Thought: {
    id: string;
  };
  ThoughtWriting: undefined;
  ThoughtShare: ThoughtShare;
  NewsWebView: {
    id: number;
  };
  UserEdit: undefined;
  UserItemEdit: {
    type: 'name' | 'bio' | Socials;
    value: string | null;
    setValue: (v: string | null) => void;
  };
  UserProfile: {
    id: string;
  };
  Settings: undefined;
  ThoughtTalkRoom: NavigatorScreenParams<ThoughtTalkRoomStackParamList>;
  NewsTalkRoom: NavigatorScreenParams<NewsTalkRoomStackParamList>;
  OneOnOneTalkRoom: NavigatorScreenParams<OneOnOneTalkRoomStackParamList>;
} & SettingsParamList &
  ThoughtTalkRoomStackParamList &
  NewsTalkRoomStackParamList &
  OneOnOneTalkRoomStackParamList;

export type RootNavigationScreenProp<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RootNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

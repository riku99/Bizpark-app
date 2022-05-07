import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { PushNotificationMessage } from 'src/generated/graphql';
import { RootStackParamList } from 'src/navigations';
import { AuthStackParamList } from 'src/navigations/Auth';
import { HomeStackParamList } from 'src/navigations/Home';
import { MainStackParamList } from 'src/navigations/Main';
import { NewsTalkRoomStackParamList } from 'src/navigations/NewsTalkRoom';
import { OneOnOneTalkRoomStackParamList } from 'src/navigations/OneOnOneTalkRoom';
import { SettingsParamList } from 'src/navigations/Settings';
import { ThoughtTalkRoomStackParamList } from 'src/navigations/ThoughtTalkRoom';

export type PushNotificationData = PushNotificationMessage;

export type ThoughtShare = {
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

export type AllStackParamList = RootStackParamList &
  MainStackParamList &
  AuthStackParamList &
  SettingsParamList &
  ThoughtTalkRoomStackParamList &
  NewsTalkRoomStackParamList &
  OneOnOneTalkRoomStackParamList &
  HomeStackParamList;

export type RootNavigationScreenProp<T extends keyof AllStackParamList> =
  NativeStackScreenProps<AllStackParamList, T>;

export type RootNavigationProp<T extends keyof AllStackParamList> =
  NativeStackNavigationProp<AllStackParamList, T>;

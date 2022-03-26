import {
  MaterialTopTabScreenProps,
  MaterialTopTabNavigationProp,
} from '@react-navigation/material-top-tabs';

export type TopTabParamList = {
  Business: undefined;
  Politics: undefined;
  Economy: undefined;
  Technology: undefined;
};

export type TopTabScreenProp<T extends keyof TopTabParamList> =
  MaterialTopTabScreenProps<TopTabParamList, T>;

export type TopTabNavigationProp<T extends keyof TopTabParamList> =
  MaterialTopTabNavigationProp<TopTabParamList, T>;

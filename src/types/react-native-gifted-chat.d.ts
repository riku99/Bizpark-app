import 'react-native-gifted-chat';

declare module 'react-native-gifted-chat' {
  interface IMessage {
    replyMessage?: {
      id: number;
      text: string;
      user: {
        id;
        name;
      };
    } | null;
  }
}

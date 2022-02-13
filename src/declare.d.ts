import { IMessage } from 'react-native-gifted-chat';

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

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

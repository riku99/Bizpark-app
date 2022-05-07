declare module 'react-native-heic-converter' {
  type ReturnObj = {
    path: string;
  };

  const RNHeicConverter: {
    convert: ({ path }: { path: string }) => Promise<ReturnObj>;
  };

  export default RNHeicConverter;
}

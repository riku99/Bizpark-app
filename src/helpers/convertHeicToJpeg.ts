import RNHeicConverter from 'react-native-heic-converter';

export const convertHeicToJpeg = async (path: string) => {
  const convertedResult = await RNHeicConverter.convert({
    path,
  });

  const jpegPath = convertedResult.path;
  const type = 'image/jpeg';

  return {
    path: jpegPath,
    type,
  };
};

import { ReactNativeFile } from 'apollo-upload-client';
import {
  Box,
  Button,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
} from 'native-base';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { CloseButton } from 'src/components/BackButon';
import {
  Genre,
  ImageInput,
  useCreateThoughtMutation,
  useUploadThoughtImagesMutation,
} from 'src/generated/graphql';
import { convertHeicToJpeg } from 'src/helpers/convertHeicToJpeg';
import { creatingThoughtVar } from 'src/stores/thought';
import { RootNavigationScreenProp } from 'src/types';
import { getExtention } from 'src/utils';
import { GenreMenu } from './GenreMenu';

type Props = RootNavigationScreenProp<'ThoughtShare'>;

export const ThoughtShareScreen = ({ navigation, route }: Props) => {
  const { title, text, images } = route.params;
  const [uploadMutation] = useUploadThoughtImagesMutation();
  const [createThoughtMutation] = useCreateThoughtMutation();
  const toast = useToast();

  const [genre, setGenre] = useState<Genre>();

  const onSharePress = useCallback(async () => {
    if (!text) {
      Alert.alert(
        'テキストがありません',
        '前のページに戻りテキストを入力してください'
      );
      return;
    }

    if (!genre) {
      Alert.alert('ジャンルが選択されていません', 'ジャンルを選択してください');
      return;
    }

    let imageInput: ImageInput[] | undefined;

    try {
      creatingThoughtVar(true);
      navigation.navigate('Tab');
      if (images.length) {
        const promises: Promise<ReactNativeFile>[] = [];

        images.forEach((image) => {
          promises.push(
            (async () => {
              let uri = image.url;
              let type = image.mime;

              const ext = getExtention(image.url);

              if (ext === 'HEIC') {
                const { path: jpegPath, type: jpegType } =
                  await convertHeicToJpeg(image.url);

                uri = jpegPath;
                type = jpegType;
              }

              return new ReactNativeFile({
                uri,
                type,
                name: `image-${Date.now()}`,
              });
            })()
          );
        });

        const files = await Promise.all(promises);

        const { data: imageData } = await uploadMutation({
          variables: {
            files,
          },
        });

        imageInput = imageData.uploadThoughtImages.images.map((i) => ({
          url: i.url,
          width: i.width,
          height: i.height,
        }));
      }

      await createThoughtMutation({
        variables: {
          input: {
            title,
            text,
            images: imageInput,
            genre,
          },
        },
      });

      toast.show('投稿しました', { type: 'success' });
    } catch (e) {
    } finally {
      creatingThoughtVar(false);
    }
  }, [
    createThoughtMutation,
    images,
    text,
    title,
    toast,
    uploadMutation,
    genre,
    navigation,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <Pressable>
          <Text
            fontWeight="bold"
            color={genre ? 'pink' : 'lightGray'}
            fontSize={16}
            onPress={onSharePress}
          >
            投稿
          </Text>
        </Pressable>
      ),
    });
  }, [genre, onSharePress, navigation]);

  const onMenuAction = (id: Genre) => {
    setGenre(id);
  };

  let menuText: string | null = null;
  if (genre) {
    switch (genre) {
      case Genre.Business:
        menuText = 'Business';
        break;
      case Genre.Politics:
        menuText = 'Politics';
        break;
      case Genre.Economy:
        menuText = 'Economy';
        break;
      case Genre.Society:
        menuText = 'Society';
        break;
    }
  }

  return (
    <ScrollView flex={1} px={4}>
      <GenreMenu onAction={onMenuAction}>
        {!genre ? (
          <Button
            mt={2}
            w={32}
            h={8}
            borderRadius={32}
            _text={{ fontSize: 12 }}
          >
            ジャンルを選択
          </Button>
        ) : (
          <Text mt={2} fontSize={16} fontWeight="bold" color="pink">
            ジャンル: {menuText}
          </Text>
        )}
      </GenreMenu>

      <Box px={1} mt={2}>
        {!!title && (
          <Text mt={4} fontWeight="bold" fontSize={17}>
            {title}
          </Text>
        )}

        <Text mt={4}>{text}</Text>

        <HStack space={4} mt={8}>
          {images.map((img) => (
            <Image
              key={img.url}
              source={{ uri: img.url }}
              w={IMAGE_SIZE}
              h={IMAGE_SIZE}
              size={IMAGE_SIZE}
              alt={''}
            />
          ))}
        </HStack>
      </Box>
    </ScrollView>
  );
};

const IMAGE_SIZE = 55;

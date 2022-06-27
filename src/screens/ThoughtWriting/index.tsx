import { Box, Input, Pressable, Text, useColorModeValue } from 'native-base';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Alert, InputAccessoryView, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { CloseButton } from 'src/components/BackButon';
import { useCheckedTermsOfUse } from 'src/hooks/termsOfUse';
import { RootNavigationScreenProp } from 'src/types';
import { TextKeyboardAccessory } from './TextKeyboardAccessory';
import { TitleKeyboardAccessory } from './TitleKeyboardAccessory';

type Props = RootNavigationScreenProp<'ThoughtWriting'>;

export const ThoughtWritingScreen = ({ navigation }: Props) => {
  const textInputId = 'textInput';
  const titleInputId = 'titleInput';
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState<{ url: string; mime: string }[]>([]);
  const [nextDisabled, setNextDisabled] = useState(true);

  useEffect(() => {
    if (!text || text.length > 500 || title.length > 30) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [title, text]);

  const onNextPress = () => {
    if (nextDisabled) {
      return;
    }

    navigation.navigate('ThoughtShare', {
      title,
      text,
      images,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <Pressable onPress={onNextPress}>
          <Text
            fontWeight="bold"
            color={!nextDisabled ? 'pink' : 'lightGray'}
            fontSize={16}
          >
            次へ
          </Text>
        </Pressable>
      ),
      title: '作成',
    });
  }, [text, onNextPress]);

  const { checkedTermsOfUse, setCheckedTermsOfUse } = useCheckedTermsOfUse();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (checkedTermsOfUse) {
        setCheckedTermsOfUse(false);
        Alert.alert('利用規約に同意しますか?', '', [
          {
            text: 'キャンセル',
            style: 'cancel',
            onPress: () => {
              navigation.goBack();
            },
          },
          {
            text: '同意する',
          },
        ]);
      }
    });

    return unsubscribe;
  }, [navigation, checkedTermsOfUse]);

  useEffect(() => {
    Alert.alert('投稿するには利用規約に同意する必要があります', '', [
      {
        text: '利用規約を見る',
        onPress: () => {
          setCheckedTermsOfUse(true);
          navigation.navigate('TermsOfUseModal');
        },
      },
      {
        text: '同意する',
      },
      {
        text: 'キャンセル',
        style: 'cancel',
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  }, []);

  const textInputRef = useRef<TextInput>(null);

  const onAccessoryImagePress = useCallback(async () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      maxFiles: 4,
    })
      .then((images) => {
        const imageStateData = images.map((m) => {
          return { url: m.sourceURL, mime: m.mime };
        });
        setImages(imageStateData);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        textInputRef.current?.focus();
      });
  }, []);

  const onSelectedImagesDeleteButtonPress = useCallback(
    (url: string) => {
      setImages((c) => {
        return c.filter((image) => image.url !== url);
      });
    },
    [images]
  );

  return (
    <Box flex={1} px={4}>
      <Input
        borderWidth={0}
        fontSize={17}
        fontWeight="bold"
        placeholder="タイトル (任意)"
        mt={2}
        keyboardAppearance={useColorModeValue('light', 'dark')}
        onChangeText={setTitle}
        inputAccessoryViewID={titleInputId}
      />

      <Input
        borderWidth={0}
        mt={4}
        placeholder="テキスト"
        fontSize={16}
        multiline
        h="27%"
        keyboardAppearance={useColorModeValue('light', 'dark')}
        autoFocus
        inputAccessoryViewID={textInputId}
        onChangeText={setText}
        ref={textInputRef}
      />

      <InputAccessoryView nativeID={textInputId}>
        <TextKeyboardAccessory
          text={text}
          images={images}
          onCamerarollImagePress={onAccessoryImagePress}
          onSelectedImageDeletePress={onSelectedImagesDeleteButtonPress}
        />
      </InputAccessoryView>

      <InputAccessoryView nativeID={titleInputId}>
        <TitleKeyboardAccessory title={title} />
      </InputAccessoryView>
    </Box>
  );
};

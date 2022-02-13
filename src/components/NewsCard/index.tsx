import React, { ComponentProps, useState, useEffect } from 'react';
import { Box, Pressable, Text, Divider } from 'native-base';
import { format } from 'date-fns';
import { Image } from 'src/components/Image';
import { Pick } from 'src/components/Pick';
import {
  useGetOneNewsQuery,
  useCreateNewsPickMutation,
  useDeleteNewsPickMutation,
} from 'src/generated/graphql';

type Props = {
  id: number;
  divider?: boolean;
} & ComponentProps<typeof Pressable>;

export const NewsCard = ({ id, divider, ...props }: Props) => {
  const { data: newsData } = useGetOneNewsQuery({
    variables: {
      id,
    },
    fetchPolicy: 'cache-only',
  });

  const [picked, setPicked] = useState(
    newsData ? newsData.oneNews.picked : false
  );

  const [createNewsPickMutation] = useCreateNewsPickMutation();
  const [deleteNewsPickMutation] = useDeleteNewsPickMutation();

  useEffect(() => {
    if (newsData) {
      setPicked(newsData.oneNews.picked);
    }
  }, [newsData]);

  const onCheckPress = async () => {
    try {
      if (!picked) {
        setPicked(true);
        await createNewsPickMutation({
          variables: {
            input: {
              newsId: id,
            },
          },
        });
      } else {
        setPicked(false);
        await deleteNewsPickMutation({
          variables: {
            input: {
              newsId: id,
            },
          },
        });
      }
    } catch (e) {
      console.log(e);
      setPicked((c) => !c);
    }
  };

  if (!newsData) {
    return null;
  }

  const { title, provider, articleCreatedAt, image } = newsData.oneNews;
  const formatedDate = format(
    new Date(Number(articleCreatedAt)),
    'yyyy/MM/dd HH:mm'
  );

  return (
    <>
      <Pressable w="100%" px="4" py="4" {...props}>
        <Box w="100%" flexDirection="row" justifyContent="space-between">
          <Box w="70%">
            <Text fontWeight="bold" fontSize="14">
              {title}
            </Text>
          </Box>

          {!!image && (
            <Image
              source={{
                uri: image,
              }}
              w="16"
              h="10"
            />
          )}
        </Box>

        <Box
          flexDirection="row"
          alignItems="center"
          mt="4"
          justifyContent="space-between"
        >
          <Text maxW="70%">
            {provider ?? ''}{' '}
            <Text mt="1" fontSize="10">
              {formatedDate}
            </Text>
          </Text>

          <Pick
            mr="2"
            checkBoxProp={{
              checked: picked,
              onPress: onCheckPress,
              style: {
                height: 24,
                width: 24,
                marginLeft: 6,
              },
            }}
          />
        </Box>
      </Pressable>

      {divider && (
        <Box px="4">
          <Divider />
        </Box>
      )}
    </>
  );
};

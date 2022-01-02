import React, { ComponentProps, useState } from "react";
import { Box, useColorModeValue, Text, Pressable } from "native-base";
import { Image } from "react-native-expo-image-cache";
import { CheckBox } from "../CheckBox";
import {
  useCreatePickMutation,
  useDeletePickMutation,
} from "src/generated/graphql";
import { useThoughtCacheFragment } from "src/hooks/apollo";
import { gql } from "@apollo/client";

type Props = {
  id: string;
} & ComponentProps<typeof Pressable>;

export const ThoughtCard = ({ id, ...props }: Props) => {
  const { readThoughtFragment } = useThoughtCacheFragment();
  const cacheData = readThoughtFragment(id);
  const picked = cacheData ? cacheData.picked : false;
  const [checked, setChecked] = useState(picked);
  const [createPickMutation] = useCreatePickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({ __typename: "Thought", id }),
        fragment: gql`
          fragment P on Thought {
            picked
          }
        `,
        data: {
          picked: true,
        },
      });
    },
  });
  const [deletePickMutation] = useDeletePickMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: cache.identify({ __typename: "Thought", id }),
        fragment: gql`
          fragment DeletePickFields on Thought {
            picked
          }
        `,
        data: {
          picked: false,
        },
      });
    },
  });

  const onCheckPress = async () => {
    try {
      if (!checked) {
        setChecked(true);
        await createPickMutation({
          variables: {
            input: {
              thoughtId: id,
            },
          },
        });
      } else {
        setChecked(false);
        await deletePickMutation({
          variables: {
            thoughtId: id,
          },
        });
      }
    } catch (e) {
      setChecked((c) => !c);
    }
  };

  return (
    <>
      {cacheData ? (
        <Pressable
          bg={useColorModeValue("white", "dt.darkGray")}
          borderRadius="lg"
          py={14}
          px={4}
          shadow={2}
          {...props}
        >
          <Box flexDirection="row" alignItems="center">
            <Image
              uri={cacheData.contributor.imageUrl}
              style={{ height: 34, width: 34, borderRadius: 34 }}
            />
            <Text fontWeight="bold" ml={2}>
              {cacheData.contributor.name}
            </Text>
          </Box>
          {cacheData.title && (
            <Text fontSize={16} fontWeight="bold" mt={2}>
              {cacheData.title}
            </Text>
          )}
          <Text maxH={20} mt={!cacheData.title ? 2 : 1}>
            {cacheData.text}
          </Text>
          <Box mt={2} flexDirection="row" alignItems="center">
            <Text color="pink" fontWeight="bold" fontSize={16}>
              Pick
            </Text>
            <CheckBox
              onPress={onCheckPress}
              checked={checked}
              style={{ height: 26, width: 26, marginLeft: 6 }}
            />
          </Box>
        </Pressable>
      ) : null}
    </>
  );
};

import React from "react";
import { Box, useColorModeValue, Text } from "native-base";
import { ContentsCard } from "src/components/ContentsCard";
import { UserImage } from "src/components/UserImage";

const image =
  "https://kuro-bucket-sample.s3.ap-northeast-1.amazonaws.com/IMG_0261.HEIC";

export const Profile = () => {
  return (
    <>
      <ContentsCard w="4/5" px="4" pb="8" borderRadius="lg" shadow="1">
        <Box>
          <Text fontWeight="bold" fontSize="16" alignSelf="center" mt="12">
            Riku
          </Text>
        </Box>
      </ContentsCard>

      <ContentsCard
        borderRadius="full"
        shadow="0"
        style={{
          width: 74,
          height: 74,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 32,
        }}
      >
        <UserImage uri={image} size="16" />
      </ContentsCard>
    </>
  );
};

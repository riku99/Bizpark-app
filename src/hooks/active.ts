import { useEffect } from "react";
import { useGetActiveDataQuery } from "src/generated/graphql";

// Active時に取得したいデータ
export const useActiveData = () => {
  useGetActiveDataQuery({
    fetchPolicy: "network-only",
  });
};

import { useEffect, useRef } from "react";
import { useGetActiveDataLazyQuery } from "src/generated/graphql";
import { AppState, AppStateStatus } from "react-native";

// Active時に取得したいデータ
export const useActiveData = () => {
  const [activeDataQuery] = useGetActiveDataLazyQuery({
    fetchPolicy: "network-only",
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    const onChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        if (!isInitialMount.current) {
          await activeDataQuery();
        } else {
          isInitialMount.current = false;
        }
      }
    };

    AppState.addEventListener("change", onChange);

    return () => {
      AppState.removeEventListener("change", onChange);
    };
  }, [activeDataQuery]);
};

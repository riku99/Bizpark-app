import { createClient, Provider } from "urql";
import React from "react";

const client = createClient({
  url: "http://localhost:5000/bizpark-dev/asia-northeast1/graphql",
  // fetchOptions: () => {
  //   const token = getToken();
  //   return {
  //     headers: { authorization: token ? `Bearer ${token}` : '' },
  //   };
  // },
});

type Props = {
  children: JSX.Element;
};

export const UrqlProvider = ({ children }: Props) => {
  return <Provider value={client}>{children}</Provider>;
};

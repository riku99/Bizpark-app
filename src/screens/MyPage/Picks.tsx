import React from "react";
import { Box } from "native-base";
import { PickedThoughts } from "./PickedThoughts";

export const Picks = React.memo(() => {
  return (
    <>
      <PickedThoughts />
    </>
  );
});

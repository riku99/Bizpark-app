import { makeVar } from "@apollo/client";

export const loggedIn = makeVar<boolean>(false);
export const id = makeVar<string | null>(null);
export const name = makeVar<string | null>(null);

export const meVar = {
  loggedIn,
  id,
  name,
};

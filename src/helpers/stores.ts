import { setMeVar } from "src/stores/me";
import { User } from "src/generated/graphql";

export const setMeVarWithInitialData = (data: User) => {
  const { id, name, imageUrl, bio } = data;
  setMeVar({
    loggedIn: true,
    name,
    id,
    imageUrl,
    bio,
  });
};

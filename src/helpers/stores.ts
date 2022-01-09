import { setMeVar } from "src/stores/me";
import { Me } from "src/generated/graphql";

export const setMeVarWithInitialData = (data: Me) => {
  const { id, name, imageUrl, bio } = data;
  setMeVar({
    loggedIn: true,
    name,
    id,
    imageUrl,
    bio,
  });
};

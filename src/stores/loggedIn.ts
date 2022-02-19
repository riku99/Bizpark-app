import { makeVar } from '@apollo/client';

const loggedIn = makeVar<boolean>(false);
const checkedStorage = makeVar(false);

export const loggedInVar = {
  loggedIn,
  checkedStorage,
};

export const STORAGE_KEY = 'LOGGED_IN';

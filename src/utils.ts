import { ErrorResponse } from "@apollo/client/link/error";

export const getGraphQLErrorCode = (error: any) => {
  return error.graphQLErrors[0].extensions.code;
};

export const getGraphQLError = (error: ErrorResponse, index: number) => {
  const gqlError = error.graphQLErrors[index];
  if (!gqlError) {
    return null;
  }
  return {
    code: gqlError.extensions.code as string,
    message: gqlError.message as string,
  };
};

export const createRandomStr = () =>
  (Math.random() + 1).toString(36).substring(7);

export const logJson = (data: any) => {
  console.log(JSON.stringify(data, null, 2));
};

export const getGraphQLErrorCode = (error: any) => {
  return error.graphQLErrors[0].extensions.code;
};

export const createRandomStr = () =>
  (Math.random() + 1).toString(36).substring(7);

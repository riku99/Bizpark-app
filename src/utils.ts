export const getGraphQLErrorCode = (error: any) => {
  return error.graphQLErrors[0].extensions.code;
};

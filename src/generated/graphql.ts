import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  Void: any;
};

export type CreateNewsPickInput = {
  newsId: Scalars['ID'];
};

export type CreateNewsPickResponse = {
  __typename?: 'CreateNewsPickResponse';
  id: Scalars['ID'];
};

export type CreatePickInput = {
  thoughtId: Scalars['String'];
};

export type CreateThoughtInput = {
  genre: Genre;
  images?: InputMaybe<Array<ImageInput>>;
  text: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type CreateThoughtResponse = {
  __typename?: 'CreateThoughtResponse';
  id: Scalars['ID'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  idToken: Scalars['String'];
  name: Scalars['String'];
};

export enum CustomErrorResponseCode {
  AlreadyUserExisting = 'ALREADY_USER_EXISTING',
  InvalidRequest = 'INVALID_REQUEST'
}

export type DeleteNewsPickInput = {
  newsId: Scalars['ID'];
};

export type DeleteThoughtInput = {
  id: Scalars['String'];
};

export type DeleteThoughtResponse = {
  __typename?: 'DeleteThoughtResponse';
  id: Scalars['ID'];
};

export enum Genre {
  Business = 'BUSINESS',
  Economy = 'ECONOMY',
  Politics = 'POLITICS',
  Society = 'SOCIETY'
}

export type Image = {
  __typename?: 'Image';
  height?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type ImageInput = {
  height?: InputMaybe<Scalars['Int']>;
  url: Scalars['String'];
  width?: InputMaybe<Scalars['Int']>;
};

export type InitialResponse = {
  __typename?: 'InitialResponse';
  me: User;
};

export type Me = {
  __typename?: 'Me';
  bio?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNewsPick: NewsPick;
  createPick: Pick;
  createThought: CreateThoughtResponse;
  createUser: Me;
  deleteNewsPick: NewsPick;
  deletePick: Pick;
  deleteThought: DeleteThoughtResponse;
  signOut: SignOutResponse;
  uploadThoughtImages: UploadThoughtImagesResponse;
};


export type MutationCreateNewsPickArgs = {
  input: CreateNewsPickInput;
};


export type MutationCreatePickArgs = {
  input: CreatePickInput;
};


export type MutationCreateThoughtArgs = {
  input: CreateThoughtInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteNewsPickArgs = {
  input: DeleteNewsPickInput;
};


export type MutationDeletePickArgs = {
  thoughtId: Scalars['ID'];
};


export type MutationDeleteThoughtArgs = {
  input: DeleteThoughtInput;
};


export type MutationUploadThoughtImagesArgs = {
  files: Array<Scalars['Upload']>;
};

export type News = {
  __typename?: 'News';
  articleCreatedAt?: Maybe<Scalars['String']>;
  genre: NewsGenre;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  link: Scalars['String'];
  picked: Scalars['Boolean'];
  provider?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type NewsConnection = {
  __typename?: 'NewsConnection';
  edges: Array<NewsEdge>;
  pageInfo: PageInfo;
};

export type NewsEdge = {
  __typename?: 'NewsEdge';
  cursor: Scalars['String'];
  node: News;
};

export enum NewsGenre {
  Business = 'BUSINESS',
  Economy = 'ECONOMY',
  Politics = 'POLITICS',
  Technology = 'TECHNOLOGY'
}

export type NewsPick = {
  __typename?: 'NewsPick';
  id: Scalars['ID'];
  newsId: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Pick = {
  __typename?: 'Pick';
  id: Scalars['ID'];
  thoughtId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  initialData: InitialResponse;
  me: Me;
  news?: Maybe<NewsConnection>;
  thoughts: ThoughtsConnection;
};


export type QueryNewsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  genre: NewsGenre;
};


export type QueryThoughtsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  genre: Genre;
};

export type SignOutResponse = {
  __typename?: 'SignOutResponse';
  id: Scalars['ID'];
};

export type SubImage = {
  __typename?: 'SubImage';
  height?: Maybe<Scalars['Int']>;
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
};

export type Thought = {
  __typename?: 'Thought';
  contributor?: Maybe<User>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images: Array<Maybe<Image>>;
  picked: Scalars['Boolean'];
  text: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type ThoughtEdge = {
  __typename?: 'ThoughtEdge';
  cursor: Scalars['String'];
  node: Thought;
};

export type ThoughtsConnection = {
  __typename?: 'ThoughtsConnection';
  edges: Array<ThoughtEdge>;
  pageInfo: PageInfo;
};

export type UploadThoughtImagesResponse = {
  __typename?: 'UploadThoughtImagesResponse';
  images: Array<SubImage>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: Maybe<Scalars['String']>;
};

export type NewsFieldsFragment = { __typename?: 'News', id: string, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean };

export type CreateNewsPickMutationVariables = Exact<{
  input: CreateNewsPickInput;
}>;


export type CreateNewsPickMutation = { __typename?: 'Mutation', createNewsPick: { __typename?: 'NewsPick', id: string, newsId: string } };

export type CreatePickMutationVariables = Exact<{
  input: CreatePickInput;
}>;


export type CreatePickMutation = { __typename?: 'Mutation', createPick: { __typename?: 'Pick', id: string, thoughtId: string } };

export type CreateThoughtMutationVariables = Exact<{
  input: CreateThoughtInput;
}>;


export type CreateThoughtMutation = { __typename?: 'Mutation', createThought: { __typename?: 'CreateThoughtResponse', id: string } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'Me', id: string, name: string } };

export type DeleteNewsPickMutationVariables = Exact<{
  input: DeleteNewsPickInput;
}>;


export type DeleteNewsPickMutation = { __typename?: 'Mutation', deleteNewsPick: { __typename?: 'NewsPick', id: string, newsId: string } };

export type DeletePickMutationVariables = Exact<{
  thoughtId: Scalars['ID'];
}>;


export type DeletePickMutation = { __typename?: 'Mutation', deletePick: { __typename?: 'Pick', id: string, thoughtId: string } };

export type DeleteThoughtMutationVariables = Exact<{
  input: DeleteThoughtInput;
}>;


export type DeleteThoughtMutation = { __typename?: 'Mutation', deleteThought: { __typename?: 'DeleteThoughtResponse', id: string } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: { __typename?: 'SignOutResponse', id: string } };

export type UploadThoughtImagesMutationVariables = Exact<{
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;


export type UploadThoughtImagesMutation = { __typename?: 'Mutation', uploadThoughtImages: { __typename?: 'UploadThoughtImagesResponse', images: Array<{ __typename?: 'SubImage', url: string, width?: number | null | undefined, height?: number | null | undefined }> } };

export type InitialDataQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialDataQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } };

export type NewsQueryVariables = Exact<{
  genre: NewsGenre;
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type NewsQuery = { __typename?: 'Query', news?: { __typename?: 'NewsConnection', edges: Array<{ __typename?: 'NewsEdge', cursor: string, node: { __typename?: 'News', id: string, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined };

export type ThoughtsQueryVariables = Exact<{
  genre: Genre;
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type ThoughtsQuery = { __typename?: 'Query', thoughts: { __typename?: 'ThoughtsConnection', edges: Array<{ __typename?: 'ThoughtEdge', cursor: string, node: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, picked: boolean, contributor?: { __typename?: 'User', id: string, name: string, imageUrl?: string | null | undefined } | null | undefined, images: Array<{ __typename?: 'Image', id: string, url: string, width?: number | null | undefined, height?: number | null | undefined } | null | undefined> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } };

export const NewsFieldsFragmentDoc = gql`
    fragment NewsFields on News {
  id
  title
  link
  image
  articleCreatedAt
  genre
  provider
  picked
}
    `;
export const CreateNewsPickDocument = gql`
    mutation CreateNewsPick($input: CreateNewsPickInput!) {
  createNewsPick(input: $input) {
    id
    newsId
  }
}
    `;
export type CreateNewsPickMutationFn = Apollo.MutationFunction<CreateNewsPickMutation, CreateNewsPickMutationVariables>;

/**
 * __useCreateNewsPickMutation__
 *
 * To run a mutation, you first call `useCreateNewsPickMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewsPickMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewsPickMutation, { data, loading, error }] = useCreateNewsPickMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNewsPickMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewsPickMutation, CreateNewsPickMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewsPickMutation, CreateNewsPickMutationVariables>(CreateNewsPickDocument, options);
      }
export type CreateNewsPickMutationHookResult = ReturnType<typeof useCreateNewsPickMutation>;
export type CreateNewsPickMutationResult = Apollo.MutationResult<CreateNewsPickMutation>;
export type CreateNewsPickMutationOptions = Apollo.BaseMutationOptions<CreateNewsPickMutation, CreateNewsPickMutationVariables>;
export const CreatePickDocument = gql`
    mutation CreatePick($input: CreatePickInput!) {
  createPick(input: $input) {
    id
    thoughtId
  }
}
    `;
export type CreatePickMutationFn = Apollo.MutationFunction<CreatePickMutation, CreatePickMutationVariables>;

/**
 * __useCreatePickMutation__
 *
 * To run a mutation, you first call `useCreatePickMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePickMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPickMutation, { data, loading, error }] = useCreatePickMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePickMutation(baseOptions?: Apollo.MutationHookOptions<CreatePickMutation, CreatePickMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePickMutation, CreatePickMutationVariables>(CreatePickDocument, options);
      }
export type CreatePickMutationHookResult = ReturnType<typeof useCreatePickMutation>;
export type CreatePickMutationResult = Apollo.MutationResult<CreatePickMutation>;
export type CreatePickMutationOptions = Apollo.BaseMutationOptions<CreatePickMutation, CreatePickMutationVariables>;
export const CreateThoughtDocument = gql`
    mutation CreateThought($input: CreateThoughtInput!) {
  createThought(input: $input) {
    id
  }
}
    `;
export type CreateThoughtMutationFn = Apollo.MutationFunction<CreateThoughtMutation, CreateThoughtMutationVariables>;

/**
 * __useCreateThoughtMutation__
 *
 * To run a mutation, you first call `useCreateThoughtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThoughtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThoughtMutation, { data, loading, error }] = useCreateThoughtMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateThoughtMutation(baseOptions?: Apollo.MutationHookOptions<CreateThoughtMutation, CreateThoughtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThoughtMutation, CreateThoughtMutationVariables>(CreateThoughtDocument, options);
      }
export type CreateThoughtMutationHookResult = ReturnType<typeof useCreateThoughtMutation>;
export type CreateThoughtMutationResult = Apollo.MutationResult<CreateThoughtMutation>;
export type CreateThoughtMutationOptions = Apollo.BaseMutationOptions<CreateThoughtMutation, CreateThoughtMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteNewsPickDocument = gql`
    mutation DeleteNewsPick($input: DeleteNewsPickInput!) {
  deleteNewsPick(input: $input) {
    id
    newsId
  }
}
    `;
export type DeleteNewsPickMutationFn = Apollo.MutationFunction<DeleteNewsPickMutation, DeleteNewsPickMutationVariables>;

/**
 * __useDeleteNewsPickMutation__
 *
 * To run a mutation, you first call `useDeleteNewsPickMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNewsPickMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNewsPickMutation, { data, loading, error }] = useDeleteNewsPickMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteNewsPickMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNewsPickMutation, DeleteNewsPickMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNewsPickMutation, DeleteNewsPickMutationVariables>(DeleteNewsPickDocument, options);
      }
export type DeleteNewsPickMutationHookResult = ReturnType<typeof useDeleteNewsPickMutation>;
export type DeleteNewsPickMutationResult = Apollo.MutationResult<DeleteNewsPickMutation>;
export type DeleteNewsPickMutationOptions = Apollo.BaseMutationOptions<DeleteNewsPickMutation, DeleteNewsPickMutationVariables>;
export const DeletePickDocument = gql`
    mutation DeletePick($thoughtId: ID!) {
  deletePick(thoughtId: $thoughtId) {
    id
    thoughtId
  }
}
    `;
export type DeletePickMutationFn = Apollo.MutationFunction<DeletePickMutation, DeletePickMutationVariables>;

/**
 * __useDeletePickMutation__
 *
 * To run a mutation, you first call `useDeletePickMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePickMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePickMutation, { data, loading, error }] = useDeletePickMutation({
 *   variables: {
 *      thoughtId: // value for 'thoughtId'
 *   },
 * });
 */
export function useDeletePickMutation(baseOptions?: Apollo.MutationHookOptions<DeletePickMutation, DeletePickMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePickMutation, DeletePickMutationVariables>(DeletePickDocument, options);
      }
export type DeletePickMutationHookResult = ReturnType<typeof useDeletePickMutation>;
export type DeletePickMutationResult = Apollo.MutationResult<DeletePickMutation>;
export type DeletePickMutationOptions = Apollo.BaseMutationOptions<DeletePickMutation, DeletePickMutationVariables>;
export const DeleteThoughtDocument = gql`
    mutation DeleteThought($input: DeleteThoughtInput!) {
  deleteThought(input: $input) {
    id
  }
}
    `;
export type DeleteThoughtMutationFn = Apollo.MutationFunction<DeleteThoughtMutation, DeleteThoughtMutationVariables>;

/**
 * __useDeleteThoughtMutation__
 *
 * To run a mutation, you first call `useDeleteThoughtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThoughtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThoughtMutation, { data, loading, error }] = useDeleteThoughtMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteThoughtMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThoughtMutation, DeleteThoughtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThoughtMutation, DeleteThoughtMutationVariables>(DeleteThoughtDocument, options);
      }
export type DeleteThoughtMutationHookResult = ReturnType<typeof useDeleteThoughtMutation>;
export type DeleteThoughtMutationResult = Apollo.MutationResult<DeleteThoughtMutation>;
export type DeleteThoughtMutationOptions = Apollo.BaseMutationOptions<DeleteThoughtMutation, DeleteThoughtMutationVariables>;
export const SignOutDocument = gql`
    mutation SignOut {
  signOut {
    id
  }
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const UploadThoughtImagesDocument = gql`
    mutation UploadThoughtImages($files: [Upload!]!) {
  uploadThoughtImages(files: $files) {
    images {
      url
      width
      height
    }
  }
}
    `;
export type UploadThoughtImagesMutationFn = Apollo.MutationFunction<UploadThoughtImagesMutation, UploadThoughtImagesMutationVariables>;

/**
 * __useUploadThoughtImagesMutation__
 *
 * To run a mutation, you first call `useUploadThoughtImagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadThoughtImagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadThoughtImagesMutation, { data, loading, error }] = useUploadThoughtImagesMutation({
 *   variables: {
 *      files: // value for 'files'
 *   },
 * });
 */
export function useUploadThoughtImagesMutation(baseOptions?: Apollo.MutationHookOptions<UploadThoughtImagesMutation, UploadThoughtImagesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadThoughtImagesMutation, UploadThoughtImagesMutationVariables>(UploadThoughtImagesDocument, options);
      }
export type UploadThoughtImagesMutationHookResult = ReturnType<typeof useUploadThoughtImagesMutation>;
export type UploadThoughtImagesMutationResult = Apollo.MutationResult<UploadThoughtImagesMutation>;
export type UploadThoughtImagesMutationOptions = Apollo.BaseMutationOptions<UploadThoughtImagesMutation, UploadThoughtImagesMutationVariables>;
export const InitialDataDocument = gql`
    query InitialData {
  me: me {
    id
    name
    bio
    imageUrl
    facebook
    twitter
    linkedin
    instagram
  }
}
    `;

/**
 * __useInitialDataQuery__
 *
 * To run a query within a React component, call `useInitialDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitialDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitialDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useInitialDataQuery(baseOptions?: Apollo.QueryHookOptions<InitialDataQuery, InitialDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitialDataQuery, InitialDataQueryVariables>(InitialDataDocument, options);
      }
export function useInitialDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitialDataQuery, InitialDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitialDataQuery, InitialDataQueryVariables>(InitialDataDocument, options);
        }
export type InitialDataQueryHookResult = ReturnType<typeof useInitialDataQuery>;
export type InitialDataLazyQueryHookResult = ReturnType<typeof useInitialDataLazyQuery>;
export type InitialDataQueryResult = Apollo.QueryResult<InitialDataQuery, InitialDataQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    bio
    imageUrl
    facebook
    twitter
    linkedin
    instagram
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NewsDocument = gql`
    query News($genre: NewsGenre!, $cursor: String) {
  news(genre: $genre, first: 30, after: $cursor) {
    edges {
      node {
        id
        title
        link
        image
        articleCreatedAt
        genre
        provider
        picked
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useNewsQuery__
 *
 * To run a query within a React component, call `useNewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewsQuery({
 *   variables: {
 *      genre: // value for 'genre'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useNewsQuery(baseOptions: Apollo.QueryHookOptions<NewsQuery, NewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewsQuery, NewsQueryVariables>(NewsDocument, options);
      }
export function useNewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewsQuery, NewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewsQuery, NewsQueryVariables>(NewsDocument, options);
        }
export type NewsQueryHookResult = ReturnType<typeof useNewsQuery>;
export type NewsLazyQueryHookResult = ReturnType<typeof useNewsLazyQuery>;
export type NewsQueryResult = Apollo.QueryResult<NewsQuery, NewsQueryVariables>;
export const ThoughtsDocument = gql`
    query Thoughts($genre: Genre!, $cursor: String) {
  thoughts(genre: $genre, first: 20, after: $cursor) {
    edges {
      node {
        id
        title
        text
        createdAt
        contributor {
          id
          name
          imageUrl
        }
        picked
        images {
          id
          url
          width
          height
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;

/**
 * __useThoughtsQuery__
 *
 * To run a query within a React component, call `useThoughtsQuery` and pass it any options that fit your needs.
 * When your component renders, `useThoughtsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThoughtsQuery({
 *   variables: {
 *      genre: // value for 'genre'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useThoughtsQuery(baseOptions: Apollo.QueryHookOptions<ThoughtsQuery, ThoughtsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ThoughtsQuery, ThoughtsQueryVariables>(ThoughtsDocument, options);
      }
export function useThoughtsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ThoughtsQuery, ThoughtsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ThoughtsQuery, ThoughtsQueryVariables>(ThoughtsDocument, options);
        }
export type ThoughtsQueryHookResult = ReturnType<typeof useThoughtsQuery>;
export type ThoughtsLazyQueryHookResult = ReturnType<typeof useThoughtsLazyQuery>;
export type ThoughtsQueryResult = Apollo.QueryResult<ThoughtsQuery, ThoughtsQueryVariables>;
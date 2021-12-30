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
};

export type CreateUserInput = {
  email: Scalars['String'];
  idToken: Scalars['String'];
  name: Scalars['String'];
};

export enum CustomErrorResponseCode {
  AlreadyUserExisting = 'ALREADY_USER_EXISTING'
}

export enum Genre {
  Business = 'BUSINESS',
  Economy = 'ECONOMY',
  Politics = 'POLITICS',
  Society = 'SOCIETY'
}

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type Pick = {
  __typename?: 'Pick';
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  thoughts: Array<Maybe<Thought>>;
  users: Array<Maybe<User>>;
};


export type QueryThoughtsArgs = {
  genre: Genre;
};

export type Thought = {
  __typename?: 'Thought';
  contributor?: Maybe<User>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  picked: Array<Maybe<Pick>>;
  text: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string } };

export type ThoughtsQueryVariables = Exact<{
  genre: Genre;
}>;


export type ThoughtsQuery = { __typename?: 'Query', thoughts: Array<{ __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, imageUrl?: string | null | undefined } | null | undefined, picked: Array<{ __typename?: 'Pick', id: string } | null | undefined> } | null | undefined> };


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
export const ThoughtsDocument = gql`
    query Thoughts($genre: Genre!) {
  thoughts(genre: $genre) {
    id
    title
    text
    createdAt
    contributor {
      id
      name
      imageUrl
    }
    picked {
      id
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
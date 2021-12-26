import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<User>;
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  thoughts: Array<Maybe<Thought>>;
  users: Array<Maybe<User>>;
};

export type Thought = {
  __typename?: 'Thought';
  contributor?: Maybe<User>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
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

export type ThoughtsQueryVariables = Exact<{ [key: string]: never; }>;


export type ThoughtsQuery = { __typename?: 'Query', thoughts: Array<{ __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, imageUrl?: string | null | undefined } | null | undefined } | null | undefined> };


export const ThoughtsDocument = gql`
    query Thoughts {
  thoughts {
    id
    title
    text
    createdAt
    contributor {
      id
      name
      imageUrl
    }
  }
}
    `;

export function useThoughtsQuery(options: Omit<Urql.UseQueryArgs<ThoughtsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ThoughtsQuery>({ query: ThoughtsDocument, ...options });
};
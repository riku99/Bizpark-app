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
  newsId: Scalars['Int'];
};

export type CreateNewsPickResponse = {
  __typename?: 'CreateNewsPickResponse';
  id: Scalars['Int'];
};

export type CreateNewsTalkRoomMessageInput = {
  replyTo?: InputMaybe<Scalars['Int']>;
  talkRoomId: Scalars['Int'];
  text: Scalars['String'];
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

export type CreateThoughtTalkRoomMessageInput = {
  replyTo?: InputMaybe<Scalars['Int']>;
  roomId: Scalars['Int'];
  text: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  idToken: Scalars['String'];
  name: Scalars['String'];
};

export type CreateUserNewsTalkRoomMessageSeenInput = {
  messageId: Scalars['Int'];
  talkRoomId: Scalars['Int'];
};

export type CreateUserThoughtTalkRoomMessageSeenInput = {
  messageId: Scalars['Int'];
  roomId: Scalars['Int'];
};

export enum CustomErrorResponseCode {
  AlreadyUnBloking = 'ALREADY_UN_BLOKING',
  AlreadyUserExisting = 'ALREADY_USER_EXISTING',
  InvalidRequest = 'INVALID_REQUEST',
  NotFound = 'NOT_FOUND'
}

export type DeleteNewsPickInput = {
  newsId: Scalars['Int'];
};

export type DeleteThoughtInput = {
  id: Scalars['String'];
};

export type DeleteThoughtResponse = {
  __typename?: 'DeleteThoughtResponse';
  id: Scalars['ID'];
};

export type DeleteThoughtTalkRoomInput = {
  talkRoomId: Scalars['Int'];
};

export type DeleteThoughtTalkRoomMemberInput = {
  roomId: Scalars['Int'];
  userId: Scalars['ID'];
};

export type Follow = {
  __typename?: 'Follow';
  followeeId: Scalars['ID'];
  followerId: Scalars['ID'];
  id: Scalars['ID'];
};

export enum Genre {
  Business = 'BUSINESS',
  Economy = 'ECONOMY',
  Politics = 'POLITICS',
  Society = 'SOCIETY'
}

export type GetOutThoughtTalkRoomInput = {
  roomId: Scalars['Int'];
};

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

export type JoinNewsTalkRoomInput = {
  newsId: Scalars['Int'];
};

export type JoinTalkInput = {
  contributorId: Scalars['String'];
  thoughtId: Scalars['String'];
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
  block: User;
  createNewsPick: NewsPick;
  createNewsTalkRoomMessage: NewsTalkRoomMessage;
  createPick: Pick;
  createThought: CreateThoughtResponse;
  createThoughtTalkRoomMessage?: Maybe<ThoughtTalkRoomMessage>;
  createUser: Me;
  createUserNewsTalkRoomMessageSeen: NewsTalkRoom;
  createUserThoughtTalkRoomMessageSeen: ThoughtTalkRoom;
  deleteNewsPick: NewsPick;
  deletePick: Pick;
  deleteThought: DeleteThoughtResponse;
  deleteThoughtTalkRoom?: Maybe<Scalars['Boolean']>;
  deleteThoughtTalkRoomMember: ThoughtTalkRoom;
  follow: User;
  getOutThoughtTalkRoom?: Maybe<Scalars['Boolean']>;
  joinNewsTalkRoom: NewsTalkRoom;
  joinThoughtTalk: ThoughtTalkRoom;
  signOut: SignOutResponse;
  unblock: User;
  unfollow: User;
  updateMe: Me;
  uploadImage: SubImage;
  uploadThoughtImages: UploadThoughtImagesResponse;
};


export type MutationBlockArgs = {
  blockTo: Scalars['ID'];
};


export type MutationCreateNewsPickArgs = {
  input: CreateNewsPickInput;
};


export type MutationCreateNewsTalkRoomMessageArgs = {
  input: CreateNewsTalkRoomMessageInput;
};


export type MutationCreatePickArgs = {
  input: CreatePickInput;
};


export type MutationCreateThoughtArgs = {
  input: CreateThoughtInput;
};


export type MutationCreateThoughtTalkRoomMessageArgs = {
  input: CreateThoughtTalkRoomMessageInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserNewsTalkRoomMessageSeenArgs = {
  input: CreateUserNewsTalkRoomMessageSeenInput;
};


export type MutationCreateUserThoughtTalkRoomMessageSeenArgs = {
  input: CreateUserThoughtTalkRoomMessageSeenInput;
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


export type MutationDeleteThoughtTalkRoomArgs = {
  input: DeleteThoughtTalkRoomInput;
};


export type MutationDeleteThoughtTalkRoomMemberArgs = {
  input: DeleteThoughtTalkRoomMemberInput;
};


export type MutationFollowArgs = {
  followeeId: Scalars['ID'];
};


export type MutationGetOutThoughtTalkRoomArgs = {
  input: GetOutThoughtTalkRoomInput;
};


export type MutationJoinNewsTalkRoomArgs = {
  input: JoinNewsTalkRoomInput;
};


export type MutationJoinThoughtTalkArgs = {
  input: JoinTalkInput;
};


export type MutationUnblockArgs = {
  blockedUserId: Scalars['ID'];
};


export type MutationUnfollowArgs = {
  followeeId: Scalars['ID'];
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUploadImageArgs = {
  file: Scalars['Upload'];
};


export type MutationUploadThoughtImagesArgs = {
  files: Array<Scalars['Upload']>;
};

export type News = {
  __typename?: 'News';
  articleCreatedAt?: Maybe<Scalars['String']>;
  genre: NewsGenre;
  id: Scalars['Int'];
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
  id: Scalars['Int'];
  newsId: Scalars['Int'];
};

export type NewsTalkRoom = TalkRoom & {
  __typename?: 'NewsTalkRoom';
  allMessageSeen?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  members?: Maybe<NewsTalkRoomMemberConnection>;
  messages?: Maybe<NewsTalkRoomMessageConnection>;
  news?: Maybe<News>;
  updatedAt?: Maybe<Scalars['String']>;
};


export type NewsTalkRoomMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};


export type NewsTalkRoomMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};

export type NewsTalkRoomMember = TalkRoomMember & {
  __typename?: 'NewsTalkRoomMember';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  talkRoom?: Maybe<NewsTalkRoom>;
  user: User;
};

export type NewsTalkRoomMemberConnection = {
  __typename?: 'NewsTalkRoomMemberConnection';
  edges: Array<NewsTalkRoomMemberEdge>;
  pageInfo: PageInfo;
};

export type NewsTalkRoomMemberEdge = {
  __typename?: 'NewsTalkRoomMemberEdge';
  cursor: Scalars['String'];
  node: NewsTalkRoomMember;
};

export type NewsTalkRoomMessage = TalkRoomMessage & {
  __typename?: 'NewsTalkRoomMessage';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  replyMessage?: Maybe<NewsTalkRoomMessage>;
  roomId?: Maybe<Scalars['Int']>;
  sender?: Maybe<User>;
  talkRoom?: Maybe<NewsTalkRoom>;
  text: Scalars['String'];
};

export type NewsTalkRoomMessageConnection = {
  __typename?: 'NewsTalkRoomMessageConnection';
  edges: Array<NewsTalkRoomMessageEdge>;
  pageInfo: PageInfo;
};

export type NewsTalkRoomMessageEdge = {
  __typename?: 'NewsTalkRoomMessageEdge';
  cursor: Scalars['String'];
  node: NewsTalkRoomMessage;
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
  blockingUsers: Array<Maybe<User>>;
  follows: UserConnection;
  initialData: InitialResponse;
  me: Me;
  news?: Maybe<NewsConnection>;
  newsTalkRoom: NewsTalkRoom;
  newsTalkRooms: Array<NewsTalkRoom>;
  pickedNews: NewsConnection;
  pickedThoughts: ThoughtsConnection;
  thoughtTalkRoom: ThoughtTalkRoom;
  thoughtTalkRooms: Array<Maybe<ThoughtTalkRoom>>;
  thoughts: ThoughtsConnection;
  user: User;
  userThoughts: ThoughtsConnection;
};


export type QueryFollowsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  q?: InputMaybe<Scalars['String']>;
};


export type QueryNewsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  genre: NewsGenre;
};


export type QueryNewsTalkRoomArgs = {
  id: Scalars['Int'];
};


export type QueryPickedNewsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryPickedThoughtsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryThoughtTalkRoomArgs = {
  id: Scalars['Int'];
};


export type QueryThoughtsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  follow?: InputMaybe<Scalars['Boolean']>;
  genre?: InputMaybe<Genre>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserThoughtsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
  userId: Scalars['ID'];
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

export type Subscription = {
  __typename?: 'Subscription';
  newsTalkRoomMessageCreated: NewsTalkRoomMessage;
  thoughtTalkRoomMessageCreated?: Maybe<ThoughtTalkRoomMessage>;
};


export type SubscriptionNewsTalkRoomMessageCreatedArgs = {
  roomIds: Array<InputMaybe<Scalars['Int']>>;
  userId: Scalars['ID'];
};


export type SubscriptionThoughtTalkRoomMessageCreatedArgs = {
  roomIds: Array<InputMaybe<Scalars['Int']>>;
  userId: Scalars['ID'];
};

export type TalkRoom = {
  allMessageSeen?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type TalkRoomMember = {
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  talkRoom?: Maybe<TalkRoom>;
  user: User;
};

export type TalkRoomMessage = {
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  roomId?: Maybe<Scalars['Int']>;
  sender?: Maybe<User>;
  text: Scalars['String'];
};

export type Thought = {
  __typename?: 'Thought';
  contributor?: Maybe<User>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images: Array<Maybe<Image>>;
  picked?: Maybe<Scalars['Boolean']>;
  text: Scalars['String'];
  title?: Maybe<Scalars['String']>;
};

export type ThoughtEdge = {
  __typename?: 'ThoughtEdge';
  cursor: Scalars['String'];
  node: Thought;
};

export type ThoughtTalkRoom = TalkRoom & {
  __typename?: 'ThoughtTalkRoom';
  allMessageSeen?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  members?: Maybe<ThoughtTalkRoomMemberConnection>;
  messages?: Maybe<ThoughtTalkRoomMessageConnection>;
  thought?: Maybe<Thought>;
  updatedAt?: Maybe<Scalars['String']>;
};


export type ThoughtTalkRoomMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};


export type ThoughtTalkRoomMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first: Scalars['Int'];
};

export type ThoughtTalkRoomMember = TalkRoomMember & {
  __typename?: 'ThoughtTalkRoomMember';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  talkRoom?: Maybe<ThoughtTalkRoom>;
  user: User;
};

export type ThoughtTalkRoomMemberConnection = {
  __typename?: 'ThoughtTalkRoomMemberConnection';
  edges: Array<ThoughtTalkRoomMemberEdge>;
  pageInfo: PageInfo;
};

export type ThoughtTalkRoomMemberEdge = {
  __typename?: 'ThoughtTalkRoomMemberEdge';
  cursor: Scalars['String'];
  node: ThoughtTalkRoomMember;
};

export type ThoughtTalkRoomMessage = TalkRoomMessage & {
  __typename?: 'ThoughtTalkRoomMessage';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  replyMessage?: Maybe<ThoughtTalkRoomMessage>;
  roomId?: Maybe<Scalars['Int']>;
  sender?: Maybe<User>;
  talkRoom?: Maybe<ThoughtTalkRoom>;
  text: Scalars['String'];
};

export type ThoughtTalkRoomMessageConnection = {
  __typename?: 'ThoughtTalkRoomMessageConnection';
  edges: Array<ThoughtTalkRoomMessageEdge>;
  pageInfo: PageInfo;
};

export type ThoughtTalkRoomMessageEdge = {
  __typename?: 'ThoughtTalkRoomMessageEdge';
  cursor: Scalars['String'];
  node: ThoughtTalkRoomMessage;
};

export type ThoughtsConnection = {
  __typename?: 'ThoughtsConnection';
  edges: Array<ThoughtEdge>;
  pageInfo: PageInfo;
};

export type UpdateMeInput = {
  bio?: InputMaybe<Scalars['String']>;
  facebook?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  instagram?: InputMaybe<Scalars['String']>;
  linkedin?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: InputMaybe<Scalars['String']>;
};

export type UploadThoughtImagesResponse = {
  __typename?: 'UploadThoughtImagesResponse';
  images: Array<SubImage>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']>;
  blocking?: Maybe<Scalars['Boolean']>;
  facebook?: Maybe<Scalars['String']>;
  follow?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: Maybe<Scalars['String']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
};

export type NewsFieldsFragment = { __typename?: 'News', id: number, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean };

export type NewsConnectionPartsFragment = { __typename?: 'NewsConnection', edges: Array<{ __typename?: 'NewsEdge', cursor: string, node: { __typename?: 'News', id: number, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } };

export type NewsPartsFragment = { __typename?: 'News', id: number, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean };

export type NewsTalkRoomMessagePartsFragment = { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined };

export type NewsTalkRoomParentPartsFragment = { __typename?: 'News', id: number, title: string };

export type NewsTalkRoomPartsFragment = { __typename?: 'NewsTalkRoom', id: number, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'NewsTalkRoomMemberConnection', edges: Array<{ __typename?: 'NewsTalkRoomMemberEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, news?: { __typename?: 'News', id: number, title: string } | null | undefined, messages?: { __typename?: 'NewsTalkRoomMessageConnection', edges: Array<{ __typename?: 'NewsTalkRoomMessageEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined };

export type PageInfoPartsFragment = { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined };

export type ThoughtPartsFragment = { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, picked?: boolean | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, images: Array<{ __typename?: 'Image', id: string, url: string, width?: number | null | undefined, height?: number | null | undefined } | null | undefined> };

export type ThoughtTalkRoomMessagePartsFragment = { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined };

export type ThoughtTalkRoomParentPartsFragment = { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined };

export type ThoughtTalkRoomPartsFragment = { __typename?: 'ThoughtTalkRoom', id: number, createdAt?: string | null | undefined, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'ThoughtTalkRoomMemberConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMemberEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined } | null | undefined, messages?: { __typename?: 'ThoughtTalkRoomMessageConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMessageEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined };

export type ThoughtsConnectionPartsFragment = { __typename?: 'ThoughtsConnection', edges: Array<{ __typename?: 'ThoughtEdge', cursor: string, node: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, picked?: boolean | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, images: Array<{ __typename?: 'Image', id: string, url: string, width?: number | null | undefined, height?: number | null | undefined } | null | undefined> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } };

export type UserPartsFragment = { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined };

export type BlockMutationVariables = Exact<{
  blockTo: Scalars['ID'];
}>;


export type BlockMutation = { __typename?: 'Mutation', block: { __typename?: 'User', blocking?: boolean | null | undefined, follow?: boolean | null | undefined, id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } };

export type CreateNewsPickMutationVariables = Exact<{
  input: CreateNewsPickInput;
}>;


export type CreateNewsPickMutation = { __typename?: 'Mutation', createNewsPick: { __typename?: 'NewsPick', id: number, newsId: number } };

export type CreateNewsTalkRoomMessageMutationVariables = Exact<{
  input: CreateNewsTalkRoomMessageInput;
}>;


export type CreateNewsTalkRoomMessageMutation = { __typename?: 'Mutation', createNewsTalkRoomMessage: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } };

export type CreatePickMutationVariables = Exact<{
  input: CreatePickInput;
}>;


export type CreatePickMutation = { __typename?: 'Mutation', createPick: { __typename?: 'Pick', id: string, thoughtId: string } };

export type CreateThoughtMutationVariables = Exact<{
  input: CreateThoughtInput;
}>;


export type CreateThoughtMutation = { __typename?: 'Mutation', createThought: { __typename?: 'CreateThoughtResponse', id: string } };

export type CreateThoughtTalkRoomMessageMutationVariables = Exact<{
  input: CreateThoughtTalkRoomMessageInput;
}>;


export type CreateThoughtTalkRoomMessageMutation = { __typename?: 'Mutation', createThoughtTalkRoomMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } | null | undefined };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'Me', id: string, name: string } };

export type CreateUserNewsTalkRoomMessageSeenMutationVariables = Exact<{
  input: CreateUserNewsTalkRoomMessageSeenInput;
}>;


export type CreateUserNewsTalkRoomMessageSeenMutation = { __typename?: 'Mutation', createUserNewsTalkRoomMessageSeen: { __typename?: 'NewsTalkRoom', id: number, allMessageSeen?: boolean | null | undefined } };

export type CreateUserThoughtTalkRoomMessageSeenMutationVariables = Exact<{
  input: CreateUserThoughtTalkRoomMessageSeenInput;
}>;


export type CreateUserThoughtTalkRoomMessageSeenMutation = { __typename?: 'Mutation', createUserThoughtTalkRoomMessageSeen: { __typename?: 'ThoughtTalkRoom', id: number, allMessageSeen?: boolean | null | undefined } };

export type DeleteNewsPickMutationVariables = Exact<{
  input: DeleteNewsPickInput;
}>;


export type DeleteNewsPickMutation = { __typename?: 'Mutation', deleteNewsPick: { __typename?: 'NewsPick', id: number, newsId: number } };

export type DeletePickMutationVariables = Exact<{
  thoughtId: Scalars['ID'];
}>;


export type DeletePickMutation = { __typename?: 'Mutation', deletePick: { __typename?: 'Pick', id: string, thoughtId: string } };

export type DeleteThoughtMutationVariables = Exact<{
  input: DeleteThoughtInput;
}>;


export type DeleteThoughtMutation = { __typename?: 'Mutation', deleteThought: { __typename?: 'DeleteThoughtResponse', id: string } };

export type DeleteThoughtTalkRoomMutationVariables = Exact<{
  input: DeleteThoughtTalkRoomInput;
}>;


export type DeleteThoughtTalkRoomMutation = { __typename?: 'Mutation', deleteThoughtTalkRoom?: boolean | null | undefined };

export type DeleteThoughtTalkRoomMemberMutationVariables = Exact<{
  input: DeleteThoughtTalkRoomMemberInput;
}>;


export type DeleteThoughtTalkRoomMemberMutation = { __typename?: 'Mutation', deleteThoughtTalkRoomMember: { __typename?: 'ThoughtTalkRoom', id: number } };

export type FollowMutationVariables = Exact<{
  followeeId: Scalars['ID'];
}>;


export type FollowMutation = { __typename?: 'Mutation', follow: { __typename?: 'User', follow?: boolean | null | undefined, id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } };

export type GetOutThoughtTalkRoomMutationVariables = Exact<{
  input: GetOutThoughtTalkRoomInput;
}>;


export type GetOutThoughtTalkRoomMutation = { __typename?: 'Mutation', getOutThoughtTalkRoom?: boolean | null | undefined };

export type JoinNewsTalkRoomMutationVariables = Exact<{
  input: JoinNewsTalkRoomInput;
}>;


export type JoinNewsTalkRoomMutation = { __typename?: 'Mutation', joinNewsTalkRoom: { __typename?: 'NewsTalkRoom', id: number, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'NewsTalkRoomMemberConnection', edges: Array<{ __typename?: 'NewsTalkRoomMemberEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, news?: { __typename?: 'News', id: number, title: string } | null | undefined, messages?: { __typename?: 'NewsTalkRoomMessageConnection', edges: Array<{ __typename?: 'NewsTalkRoomMessageEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } };

export type JoinThoughtTalkMutationVariables = Exact<{
  input: JoinTalkInput;
}>;


export type JoinThoughtTalkMutation = { __typename?: 'Mutation', joinThoughtTalk: { __typename?: 'ThoughtTalkRoom', id: number, createdAt?: string | null | undefined, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'ThoughtTalkRoomMemberConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMemberEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined } | null | undefined, messages?: { __typename?: 'ThoughtTalkRoomMessageConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMessageEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: { __typename?: 'SignOutResponse', id: string } };

export type UnBlockMutationVariables = Exact<{
  blockedUserId: Scalars['ID'];
}>;


export type UnBlockMutation = { __typename?: 'Mutation', unblock: { __typename?: 'User', id: string, blocking?: boolean | null | undefined } };

export type UnfollowMutationVariables = Exact<{
  followeeId: Scalars['ID'];
}>;


export type UnfollowMutation = { __typename?: 'Mutation', unfollow: { __typename?: 'User', follow?: boolean | null | undefined, id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateMeInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'Me', id: string } };

export type UploadImageMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadImageMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'SubImage', url: string } };

export type UploadThoughtImagesMutationVariables = Exact<{
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;


export type UploadThoughtImagesMutation = { __typename?: 'Mutation', uploadThoughtImages: { __typename?: 'UploadThoughtImagesResponse', images: Array<{ __typename?: 'SubImage', url: string, width?: number | null | undefined, height?: number | null | undefined }> } };

export type BlockingUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type BlockingUsersQuery = { __typename?: 'Query', blockingUsers: Array<{ __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined> };

export type FollowsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']>;
  q?: InputMaybe<Scalars['String']>;
}>;


export type FollowsQuery = { __typename?: 'Query', follows: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', follow?: boolean | null | undefined, id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } };

export type GetActiveDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveDataQuery = { __typename?: 'Query', thoughtTalkRooms: Array<{ __typename?: 'ThoughtTalkRoom', id: number, createdAt?: string | null | undefined, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'ThoughtTalkRoomMemberConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMemberEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined } | null | undefined, messages?: { __typename?: 'ThoughtTalkRoomMessageConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMessageEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } | null | undefined> };

export type GetNewsTalkRoomMessagesQueryVariables = Exact<{
  talkRoomId: Scalars['Int'];
  messageCursor?: InputMaybe<Scalars['String']>;
}>;


export type GetNewsTalkRoomMessagesQuery = { __typename?: 'Query', newsTalkRoom: { __typename?: 'NewsTalkRoom', id: number, messages?: { __typename?: 'NewsTalkRoomMessageConnection', edges: Array<{ __typename?: 'NewsTalkRoomMessageEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } };

export type GetNewsTalkRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNewsTalkRoomsQuery = { __typename?: 'Query', newsTalkRooms: Array<{ __typename?: 'NewsTalkRoom', id: number, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'NewsTalkRoomMemberConnection', edges: Array<{ __typename?: 'NewsTalkRoomMemberEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, news?: { __typename?: 'News', id: number, title: string } | null | undefined, messages?: { __typename?: 'NewsTalkRoomMessageConnection', edges: Array<{ __typename?: 'NewsTalkRoomMessageEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined }> };

export type GetThoughtTalkRoomMembersQueryVariables = Exact<{
  talkRoomId: Scalars['Int'];
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetThoughtTalkRoomMembersQuery = { __typename?: 'Query', thoughtTalkRoom: { __typename?: 'ThoughtTalkRoom', id: number, members?: { __typename?: 'ThoughtTalkRoomMemberConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMemberEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } };

export type GetThoughtTalkRoomMessagesQueryVariables = Exact<{
  id: Scalars['Int'];
  messageCursor?: InputMaybe<Scalars['String']>;
}>;


export type GetThoughtTalkRoomMessagesQuery = { __typename?: 'Query', thoughtTalkRoom: { __typename?: 'ThoughtTalkRoom', id: number, messages?: { __typename?: 'ThoughtTalkRoomMessageConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMessageEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } };

export type GetThoughtTalkRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetThoughtTalkRoomsQuery = { __typename?: 'Query', thoughtTalkRooms: Array<{ __typename?: 'ThoughtTalkRoom', id: number, createdAt?: string | null | undefined, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'ThoughtTalkRoomMemberConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMemberEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined } | null | undefined, messages?: { __typename?: 'ThoughtTalkRoomMessageConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMessageEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } | null | undefined> };

export type GetThoughtTalkRoomParentQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GetThoughtTalkRoomParentQuery = { __typename?: 'Query', thoughtTalkRoom: { __typename?: 'ThoughtTalkRoom', id: number, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined } | null | undefined } };

export type InitialDataQueryVariables = Exact<{ [key: string]: never; }>;


export type InitialDataQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, instagram?: string | null | undefined, linkedin?: string | null | undefined }, thoughtTalkRooms: Array<{ __typename?: 'ThoughtTalkRoom', id: number, createdAt?: string | null | undefined, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'ThoughtTalkRoomMemberConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMemberEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string } | null | undefined } | null | undefined, messages?: { __typename?: 'ThoughtTalkRoomMessageConnection', edges: Array<{ __typename?: 'ThoughtTalkRoomMessageEdge', cursor: string, node: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined } | null | undefined>, newsTalkRooms: Array<{ __typename?: 'NewsTalkRoom', id: number, allMessageSeen?: boolean | null | undefined, members?: { __typename?: 'NewsTalkRoomMemberConnection', edges: Array<{ __typename?: 'NewsTalkRoomMemberEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMember', id: number, user: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined, news?: { __typename?: 'News', id: number, title: string } | null | undefined, messages?: { __typename?: 'NewsTalkRoomMessageConnection', edges: Array<{ __typename?: 'NewsTalkRoomMessageEdge', cursor: string, node: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, instagram?: string | null | undefined, linkedin?: string | null | undefined } };

export type NewsQueryVariables = Exact<{
  genre: NewsGenre;
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type NewsQuery = { __typename?: 'Query', news?: { __typename?: 'NewsConnection', edges: Array<{ __typename?: 'NewsEdge', cursor: string, node: { __typename?: 'News', id: number, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } | null | undefined };

export type PickedThoughtsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PickedThoughtsQuery = { __typename?: 'Query', pickedThoughts: { __typename?: 'ThoughtsConnection', edges: Array<{ __typename?: 'ThoughtEdge', cursor: string, node: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, picked?: boolean | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, images: Array<{ __typename?: 'Image', id: string, url: string, width?: number | null | undefined, height?: number | null | undefined } | null | undefined> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } };

export type ThoughtsQueryVariables = Exact<{
  genre?: InputMaybe<Genre>;
  cursor?: InputMaybe<Scalars['String']>;
  follow?: InputMaybe<Scalars['Boolean']>;
}>;


export type ThoughtsQuery = { __typename?: 'Query', thoughts: { __typename?: 'ThoughtsConnection', edges: Array<{ __typename?: 'ThoughtEdge', cursor: string, node: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, picked?: boolean | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, images: Array<{ __typename?: 'Image', id: string, url: string, width?: number | null | undefined, height?: number | null | undefined } | null | undefined> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } };

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', blocking?: boolean | null | undefined, follow?: boolean | null | undefined, id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } };

export type PickedNewsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type PickedNewsQuery = { __typename?: 'Query', pickedNews: { __typename?: 'NewsConnection', edges: Array<{ __typename?: 'NewsEdge', cursor: string, node: { __typename?: 'News', id: number, title: string, link: string, image?: string | null | undefined, articleCreatedAt?: string | null | undefined, genre: NewsGenre, provider?: string | null | undefined, picked: boolean } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } };

export type UserThoughtsQueryVariables = Exact<{
  userId: Scalars['ID'];
  cursor?: InputMaybe<Scalars['String']>;
}>;


export type UserThoughtsQuery = { __typename?: 'Query', userThoughts: { __typename?: 'ThoughtsConnection', edges: Array<{ __typename?: 'ThoughtEdge', cursor: string, node: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, createdAt?: string | null | undefined, picked?: boolean | null | undefined, contributor?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, images: Array<{ __typename?: 'Image', id: string, url: string, width?: number | null | undefined, height?: number | null | undefined } | null | undefined> } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null | undefined, endCursor?: string | null | undefined } } };

export type OnNewsTalkRoomMessageCreatedSubscriptionVariables = Exact<{
  roomIds: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
  userId: Scalars['ID'];
}>;


export type OnNewsTalkRoomMessageCreatedSubscription = { __typename?: 'Subscription', newsTalkRoomMessageCreated: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'NewsTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } };

export type OnThoughtTalkRoomMessageCreatedSubscriptionVariables = Exact<{
  roomIds: Array<InputMaybe<Scalars['Int']>> | InputMaybe<Scalars['Int']>;
  userId: Scalars['ID'];
}>;


export type OnThoughtTalkRoomMessageCreatedSubscription = { __typename?: 'Subscription', thoughtTalkRoomMessageCreated?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, roomId?: number | null | undefined, talkRoom?: { __typename?: 'ThoughtTalkRoom', id: number, updatedAt?: string | null | undefined, createdAt?: string | null | undefined, allMessageSeen?: boolean | null | undefined, thought?: { __typename?: 'Thought', id: string, title?: string | null | undefined, text: string, contributor?: { __typename?: 'User', id: string, name: string, imageUrl?: string | null | undefined } | null | undefined } | null | undefined } | null | undefined, sender?: { __typename?: 'User', id: string, name: string, bio?: string | null | undefined, imageUrl?: string | null | undefined, facebook?: string | null | undefined, twitter?: string | null | undefined, linkedin?: string | null | undefined, instagram?: string | null | undefined } | null | undefined, replyMessage?: { __typename?: 'ThoughtTalkRoomMessage', id: number, text: string, createdAt: string, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined } | null | undefined };

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
export const NewsPartsFragmentDoc = gql`
    fragment NewsParts on News {
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
export const PageInfoPartsFragmentDoc = gql`
    fragment PageInfoParts on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
}
    `;
export const NewsConnectionPartsFragmentDoc = gql`
    fragment NewsConnectionParts on NewsConnection {
  edges {
    node {
      ...NewsParts
    }
    cursor
  }
  pageInfo {
    ...PageInfoParts
  }
}
    ${NewsPartsFragmentDoc}
${PageInfoPartsFragmentDoc}`;
export const UserPartsFragmentDoc = gql`
    fragment UserParts on User {
  id
  name
  bio
  imageUrl
  facebook
  twitter
  linkedin
  instagram
}
    `;
export const NewsTalkRoomParentPartsFragmentDoc = gql`
    fragment NewsTalkRoomParentParts on News {
  id
  title
}
    `;
export const NewsTalkRoomMessagePartsFragmentDoc = gql`
    fragment NewsTalkRoomMessageParts on NewsTalkRoomMessage {
  id
  text
  createdAt
  sender {
    ...UserParts
  }
  roomId
  replyMessage {
    id
    text
    createdAt
    sender {
      id
      name
    }
  }
}
    ${UserPartsFragmentDoc}`;
export const NewsTalkRoomPartsFragmentDoc = gql`
    fragment NewsTalkRoomParts on NewsTalkRoom {
  id
  allMessageSeen
  members {
    edges {
      node {
        id
        user {
          ...UserParts
        }
      }
      cursor
    }
    pageInfo {
      ...PageInfoParts
    }
  }
  news {
    ...NewsTalkRoomParentParts
  }
  messages(first: 20) {
    edges {
      node {
        ...NewsTalkRoomMessageParts
      }
      cursor
    }
    pageInfo {
      ...PageInfoParts
    }
  }
}
    ${UserPartsFragmentDoc}
${PageInfoPartsFragmentDoc}
${NewsTalkRoomParentPartsFragmentDoc}
${NewsTalkRoomMessagePartsFragmentDoc}`;
export const ThoughtTalkRoomParentPartsFragmentDoc = gql`
    fragment ThoughtTalkRoomParentParts on Thought {
  id
  title
  text
  contributor {
    id
  }
}
    `;
export const ThoughtTalkRoomMessagePartsFragmentDoc = gql`
    fragment ThoughtTalkRoomMessageParts on ThoughtTalkRoomMessage {
  id
  text
  createdAt
  sender {
    ...UserParts
  }
  roomId
  replyMessage {
    id
    text
    createdAt
    sender {
      id
      name
    }
  }
}
    ${UserPartsFragmentDoc}`;
export const ThoughtTalkRoomPartsFragmentDoc = gql`
    fragment ThoughtTalkRoomParts on ThoughtTalkRoom {
  id
  createdAt
  allMessageSeen
  members {
    edges {
      node {
        id
        user {
          ...UserParts
        }
      }
      cursor
    }
    pageInfo {
      ...PageInfoParts
    }
  }
  thought {
    ...ThoughtTalkRoomParentParts
  }
  messages(first: 20) {
    edges {
      node {
        ...ThoughtTalkRoomMessageParts
      }
      cursor
    }
    pageInfo {
      ...PageInfoParts
    }
  }
}
    ${UserPartsFragmentDoc}
${PageInfoPartsFragmentDoc}
${ThoughtTalkRoomParentPartsFragmentDoc}
${ThoughtTalkRoomMessagePartsFragmentDoc}`;
export const ThoughtPartsFragmentDoc = gql`
    fragment ThoughtParts on Thought {
  id
  title
  text
  createdAt
  contributor {
    ...UserParts
  }
  picked
  images {
    id
    url
    width
    height
  }
}
    ${UserPartsFragmentDoc}`;
export const ThoughtsConnectionPartsFragmentDoc = gql`
    fragment ThoughtsConnectionParts on ThoughtsConnection {
  edges {
    node {
      ...ThoughtParts
    }
    cursor
  }
  pageInfo {
    ...PageInfoParts
  }
}
    ${ThoughtPartsFragmentDoc}
${PageInfoPartsFragmentDoc}`;
export const BlockDocument = gql`
    mutation Block($blockTo: ID!) {
  block(blockTo: $blockTo) {
    blocking
    follow
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
export type BlockMutationFn = Apollo.MutationFunction<BlockMutation, BlockMutationVariables>;

/**
 * __useBlockMutation__
 *
 * To run a mutation, you first call `useBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [blockMutation, { data, loading, error }] = useBlockMutation({
 *   variables: {
 *      blockTo: // value for 'blockTo'
 *   },
 * });
 */
export function useBlockMutation(baseOptions?: Apollo.MutationHookOptions<BlockMutation, BlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BlockMutation, BlockMutationVariables>(BlockDocument, options);
      }
export type BlockMutationHookResult = ReturnType<typeof useBlockMutation>;
export type BlockMutationResult = Apollo.MutationResult<BlockMutation>;
export type BlockMutationOptions = Apollo.BaseMutationOptions<BlockMutation, BlockMutationVariables>;
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
export const CreateNewsTalkRoomMessageDocument = gql`
    mutation CreateNewsTalkRoomMessage($input: CreateNewsTalkRoomMessageInput!) {
  createNewsTalkRoomMessage(input: $input) {
    ...NewsTalkRoomMessageParts
  }
}
    ${NewsTalkRoomMessagePartsFragmentDoc}`;
export type CreateNewsTalkRoomMessageMutationFn = Apollo.MutationFunction<CreateNewsTalkRoomMessageMutation, CreateNewsTalkRoomMessageMutationVariables>;

/**
 * __useCreateNewsTalkRoomMessageMutation__
 *
 * To run a mutation, you first call `useCreateNewsTalkRoomMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewsTalkRoomMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewsTalkRoomMessageMutation, { data, loading, error }] = useCreateNewsTalkRoomMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNewsTalkRoomMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateNewsTalkRoomMessageMutation, CreateNewsTalkRoomMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNewsTalkRoomMessageMutation, CreateNewsTalkRoomMessageMutationVariables>(CreateNewsTalkRoomMessageDocument, options);
      }
export type CreateNewsTalkRoomMessageMutationHookResult = ReturnType<typeof useCreateNewsTalkRoomMessageMutation>;
export type CreateNewsTalkRoomMessageMutationResult = Apollo.MutationResult<CreateNewsTalkRoomMessageMutation>;
export type CreateNewsTalkRoomMessageMutationOptions = Apollo.BaseMutationOptions<CreateNewsTalkRoomMessageMutation, CreateNewsTalkRoomMessageMutationVariables>;
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
export const CreateThoughtTalkRoomMessageDocument = gql`
    mutation CreateThoughtTalkRoomMessage($input: CreateThoughtTalkRoomMessageInput!) {
  createThoughtTalkRoomMessage(input: $input) {
    ...ThoughtTalkRoomMessageParts
  }
}
    ${ThoughtTalkRoomMessagePartsFragmentDoc}`;
export type CreateThoughtTalkRoomMessageMutationFn = Apollo.MutationFunction<CreateThoughtTalkRoomMessageMutation, CreateThoughtTalkRoomMessageMutationVariables>;

/**
 * __useCreateThoughtTalkRoomMessageMutation__
 *
 * To run a mutation, you first call `useCreateThoughtTalkRoomMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThoughtTalkRoomMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThoughtTalkRoomMessageMutation, { data, loading, error }] = useCreateThoughtTalkRoomMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateThoughtTalkRoomMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateThoughtTalkRoomMessageMutation, CreateThoughtTalkRoomMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThoughtTalkRoomMessageMutation, CreateThoughtTalkRoomMessageMutationVariables>(CreateThoughtTalkRoomMessageDocument, options);
      }
export type CreateThoughtTalkRoomMessageMutationHookResult = ReturnType<typeof useCreateThoughtTalkRoomMessageMutation>;
export type CreateThoughtTalkRoomMessageMutationResult = Apollo.MutationResult<CreateThoughtTalkRoomMessageMutation>;
export type CreateThoughtTalkRoomMessageMutationOptions = Apollo.BaseMutationOptions<CreateThoughtTalkRoomMessageMutation, CreateThoughtTalkRoomMessageMutationVariables>;
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
export const CreateUserNewsTalkRoomMessageSeenDocument = gql`
    mutation CreateUserNewsTalkRoomMessageSeen($input: CreateUserNewsTalkRoomMessageSeenInput!) {
  createUserNewsTalkRoomMessageSeen(input: $input) {
    id
    allMessageSeen
  }
}
    `;
export type CreateUserNewsTalkRoomMessageSeenMutationFn = Apollo.MutationFunction<CreateUserNewsTalkRoomMessageSeenMutation, CreateUserNewsTalkRoomMessageSeenMutationVariables>;

/**
 * __useCreateUserNewsTalkRoomMessageSeenMutation__
 *
 * To run a mutation, you first call `useCreateUserNewsTalkRoomMessageSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserNewsTalkRoomMessageSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserNewsTalkRoomMessageSeenMutation, { data, loading, error }] = useCreateUserNewsTalkRoomMessageSeenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserNewsTalkRoomMessageSeenMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserNewsTalkRoomMessageSeenMutation, CreateUserNewsTalkRoomMessageSeenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserNewsTalkRoomMessageSeenMutation, CreateUserNewsTalkRoomMessageSeenMutationVariables>(CreateUserNewsTalkRoomMessageSeenDocument, options);
      }
export type CreateUserNewsTalkRoomMessageSeenMutationHookResult = ReturnType<typeof useCreateUserNewsTalkRoomMessageSeenMutation>;
export type CreateUserNewsTalkRoomMessageSeenMutationResult = Apollo.MutationResult<CreateUserNewsTalkRoomMessageSeenMutation>;
export type CreateUserNewsTalkRoomMessageSeenMutationOptions = Apollo.BaseMutationOptions<CreateUserNewsTalkRoomMessageSeenMutation, CreateUserNewsTalkRoomMessageSeenMutationVariables>;
export const CreateUserThoughtTalkRoomMessageSeenDocument = gql`
    mutation CreateUserThoughtTalkRoomMessageSeen($input: CreateUserThoughtTalkRoomMessageSeenInput!) {
  createUserThoughtTalkRoomMessageSeen(input: $input) {
    id
    allMessageSeen
  }
}
    `;
export type CreateUserThoughtTalkRoomMessageSeenMutationFn = Apollo.MutationFunction<CreateUserThoughtTalkRoomMessageSeenMutation, CreateUserThoughtTalkRoomMessageSeenMutationVariables>;

/**
 * __useCreateUserThoughtTalkRoomMessageSeenMutation__
 *
 * To run a mutation, you first call `useCreateUserThoughtTalkRoomMessageSeenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserThoughtTalkRoomMessageSeenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserThoughtTalkRoomMessageSeenMutation, { data, loading, error }] = useCreateUserThoughtTalkRoomMessageSeenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserThoughtTalkRoomMessageSeenMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserThoughtTalkRoomMessageSeenMutation, CreateUserThoughtTalkRoomMessageSeenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserThoughtTalkRoomMessageSeenMutation, CreateUserThoughtTalkRoomMessageSeenMutationVariables>(CreateUserThoughtTalkRoomMessageSeenDocument, options);
      }
export type CreateUserThoughtTalkRoomMessageSeenMutationHookResult = ReturnType<typeof useCreateUserThoughtTalkRoomMessageSeenMutation>;
export type CreateUserThoughtTalkRoomMessageSeenMutationResult = Apollo.MutationResult<CreateUserThoughtTalkRoomMessageSeenMutation>;
export type CreateUserThoughtTalkRoomMessageSeenMutationOptions = Apollo.BaseMutationOptions<CreateUserThoughtTalkRoomMessageSeenMutation, CreateUserThoughtTalkRoomMessageSeenMutationVariables>;
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
export const DeleteThoughtTalkRoomDocument = gql`
    mutation DeleteThoughtTalkRoom($input: DeleteThoughtTalkRoomInput!) {
  deleteThoughtTalkRoom(input: $input)
}
    `;
export type DeleteThoughtTalkRoomMutationFn = Apollo.MutationFunction<DeleteThoughtTalkRoomMutation, DeleteThoughtTalkRoomMutationVariables>;

/**
 * __useDeleteThoughtTalkRoomMutation__
 *
 * To run a mutation, you first call `useDeleteThoughtTalkRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThoughtTalkRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThoughtTalkRoomMutation, { data, loading, error }] = useDeleteThoughtTalkRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteThoughtTalkRoomMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThoughtTalkRoomMutation, DeleteThoughtTalkRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThoughtTalkRoomMutation, DeleteThoughtTalkRoomMutationVariables>(DeleteThoughtTalkRoomDocument, options);
      }
export type DeleteThoughtTalkRoomMutationHookResult = ReturnType<typeof useDeleteThoughtTalkRoomMutation>;
export type DeleteThoughtTalkRoomMutationResult = Apollo.MutationResult<DeleteThoughtTalkRoomMutation>;
export type DeleteThoughtTalkRoomMutationOptions = Apollo.BaseMutationOptions<DeleteThoughtTalkRoomMutation, DeleteThoughtTalkRoomMutationVariables>;
export const DeleteThoughtTalkRoomMemberDocument = gql`
    mutation DeleteThoughtTalkRoomMember($input: DeleteThoughtTalkRoomMemberInput!) {
  deleteThoughtTalkRoomMember(input: $input) {
    id
  }
}
    `;
export type DeleteThoughtTalkRoomMemberMutationFn = Apollo.MutationFunction<DeleteThoughtTalkRoomMemberMutation, DeleteThoughtTalkRoomMemberMutationVariables>;

/**
 * __useDeleteThoughtTalkRoomMemberMutation__
 *
 * To run a mutation, you first call `useDeleteThoughtTalkRoomMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThoughtTalkRoomMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThoughtTalkRoomMemberMutation, { data, loading, error }] = useDeleteThoughtTalkRoomMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteThoughtTalkRoomMemberMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThoughtTalkRoomMemberMutation, DeleteThoughtTalkRoomMemberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThoughtTalkRoomMemberMutation, DeleteThoughtTalkRoomMemberMutationVariables>(DeleteThoughtTalkRoomMemberDocument, options);
      }
export type DeleteThoughtTalkRoomMemberMutationHookResult = ReturnType<typeof useDeleteThoughtTalkRoomMemberMutation>;
export type DeleteThoughtTalkRoomMemberMutationResult = Apollo.MutationResult<DeleteThoughtTalkRoomMemberMutation>;
export type DeleteThoughtTalkRoomMemberMutationOptions = Apollo.BaseMutationOptions<DeleteThoughtTalkRoomMemberMutation, DeleteThoughtTalkRoomMemberMutationVariables>;
export const FollowDocument = gql`
    mutation Follow($followeeId: ID!) {
  follow(followeeId: $followeeId) {
    follow
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
export type FollowMutationFn = Apollo.MutationFunction<FollowMutation, FollowMutationVariables>;

/**
 * __useFollowMutation__
 *
 * To run a mutation, you first call `useFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followMutation, { data, loading, error }] = useFollowMutation({
 *   variables: {
 *      followeeId: // value for 'followeeId'
 *   },
 * });
 */
export function useFollowMutation(baseOptions?: Apollo.MutationHookOptions<FollowMutation, FollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowMutation, FollowMutationVariables>(FollowDocument, options);
      }
export type FollowMutationHookResult = ReturnType<typeof useFollowMutation>;
export type FollowMutationResult = Apollo.MutationResult<FollowMutation>;
export type FollowMutationOptions = Apollo.BaseMutationOptions<FollowMutation, FollowMutationVariables>;
export const GetOutThoughtTalkRoomDocument = gql`
    mutation GetOutThoughtTalkRoom($input: GetOutThoughtTalkRoomInput!) {
  getOutThoughtTalkRoom(input: $input)
}
    `;
export type GetOutThoughtTalkRoomMutationFn = Apollo.MutationFunction<GetOutThoughtTalkRoomMutation, GetOutThoughtTalkRoomMutationVariables>;

/**
 * __useGetOutThoughtTalkRoomMutation__
 *
 * To run a mutation, you first call `useGetOutThoughtTalkRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetOutThoughtTalkRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getOutThoughtTalkRoomMutation, { data, loading, error }] = useGetOutThoughtTalkRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetOutThoughtTalkRoomMutation(baseOptions?: Apollo.MutationHookOptions<GetOutThoughtTalkRoomMutation, GetOutThoughtTalkRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GetOutThoughtTalkRoomMutation, GetOutThoughtTalkRoomMutationVariables>(GetOutThoughtTalkRoomDocument, options);
      }
export type GetOutThoughtTalkRoomMutationHookResult = ReturnType<typeof useGetOutThoughtTalkRoomMutation>;
export type GetOutThoughtTalkRoomMutationResult = Apollo.MutationResult<GetOutThoughtTalkRoomMutation>;
export type GetOutThoughtTalkRoomMutationOptions = Apollo.BaseMutationOptions<GetOutThoughtTalkRoomMutation, GetOutThoughtTalkRoomMutationVariables>;
export const JoinNewsTalkRoomDocument = gql`
    mutation JoinNewsTalkRoom($input: JoinNewsTalkRoomInput!) {
  joinNewsTalkRoom(input: $input) {
    ...NewsTalkRoomParts
  }
}
    ${NewsTalkRoomPartsFragmentDoc}`;
export type JoinNewsTalkRoomMutationFn = Apollo.MutationFunction<JoinNewsTalkRoomMutation, JoinNewsTalkRoomMutationVariables>;

/**
 * __useJoinNewsTalkRoomMutation__
 *
 * To run a mutation, you first call `useJoinNewsTalkRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinNewsTalkRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinNewsTalkRoomMutation, { data, loading, error }] = useJoinNewsTalkRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJoinNewsTalkRoomMutation(baseOptions?: Apollo.MutationHookOptions<JoinNewsTalkRoomMutation, JoinNewsTalkRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinNewsTalkRoomMutation, JoinNewsTalkRoomMutationVariables>(JoinNewsTalkRoomDocument, options);
      }
export type JoinNewsTalkRoomMutationHookResult = ReturnType<typeof useJoinNewsTalkRoomMutation>;
export type JoinNewsTalkRoomMutationResult = Apollo.MutationResult<JoinNewsTalkRoomMutation>;
export type JoinNewsTalkRoomMutationOptions = Apollo.BaseMutationOptions<JoinNewsTalkRoomMutation, JoinNewsTalkRoomMutationVariables>;
export const JoinThoughtTalkDocument = gql`
    mutation JoinThoughtTalk($input: JoinTalkInput!) {
  joinThoughtTalk(input: $input) {
    ...ThoughtTalkRoomParts
  }
}
    ${ThoughtTalkRoomPartsFragmentDoc}`;
export type JoinThoughtTalkMutationFn = Apollo.MutationFunction<JoinThoughtTalkMutation, JoinThoughtTalkMutationVariables>;

/**
 * __useJoinThoughtTalkMutation__
 *
 * To run a mutation, you first call `useJoinThoughtTalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinThoughtTalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinThoughtTalkMutation, { data, loading, error }] = useJoinThoughtTalkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJoinThoughtTalkMutation(baseOptions?: Apollo.MutationHookOptions<JoinThoughtTalkMutation, JoinThoughtTalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinThoughtTalkMutation, JoinThoughtTalkMutationVariables>(JoinThoughtTalkDocument, options);
      }
export type JoinThoughtTalkMutationHookResult = ReturnType<typeof useJoinThoughtTalkMutation>;
export type JoinThoughtTalkMutationResult = Apollo.MutationResult<JoinThoughtTalkMutation>;
export type JoinThoughtTalkMutationOptions = Apollo.BaseMutationOptions<JoinThoughtTalkMutation, JoinThoughtTalkMutationVariables>;
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
export const UnBlockDocument = gql`
    mutation UnBlock($blockedUserId: ID!) {
  unblock(blockedUserId: $blockedUserId) {
    id
    blocking
  }
}
    `;
export type UnBlockMutationFn = Apollo.MutationFunction<UnBlockMutation, UnBlockMutationVariables>;

/**
 * __useUnBlockMutation__
 *
 * To run a mutation, you first call `useUnBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unBlockMutation, { data, loading, error }] = useUnBlockMutation({
 *   variables: {
 *      blockedUserId: // value for 'blockedUserId'
 *   },
 * });
 */
export function useUnBlockMutation(baseOptions?: Apollo.MutationHookOptions<UnBlockMutation, UnBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnBlockMutation, UnBlockMutationVariables>(UnBlockDocument, options);
      }
export type UnBlockMutationHookResult = ReturnType<typeof useUnBlockMutation>;
export type UnBlockMutationResult = Apollo.MutationResult<UnBlockMutation>;
export type UnBlockMutationOptions = Apollo.BaseMutationOptions<UnBlockMutation, UnBlockMutationVariables>;
export const UnfollowDocument = gql`
    mutation Unfollow($followeeId: ID!) {
  unfollow(followeeId: $followeeId) {
    follow
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;
export type UnfollowMutationFn = Apollo.MutationFunction<UnfollowMutation, UnfollowMutationVariables>;

/**
 * __useUnfollowMutation__
 *
 * To run a mutation, you first call `useUnfollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowMutation, { data, loading, error }] = useUnfollowMutation({
 *   variables: {
 *      followeeId: // value for 'followeeId'
 *   },
 * });
 */
export function useUnfollowMutation(baseOptions?: Apollo.MutationHookOptions<UnfollowMutation, UnfollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnfollowMutation, UnfollowMutationVariables>(UnfollowDocument, options);
      }
export type UnfollowMutationHookResult = ReturnType<typeof useUnfollowMutation>;
export type UnfollowMutationResult = Apollo.MutationResult<UnfollowMutation>;
export type UnfollowMutationOptions = Apollo.BaseMutationOptions<UnfollowMutation, UnfollowMutationVariables>;
export const UpdateMeDocument = gql`
    mutation UpdateMe($input: UpdateMeInput!) {
  updateMe(input: $input) {
    id
  }
}
    `;
export type UpdateMeMutationFn = Apollo.MutationFunction<UpdateMeMutation, UpdateMeMutationVariables>;

/**
 * __useUpdateMeMutation__
 *
 * To run a mutation, you first call `useUpdateMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeMutation, { data, loading, error }] = useUpdateMeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeMutation, UpdateMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument, options);
      }
export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>;
export type UpdateMeMutationResult = Apollo.MutationResult<UpdateMeMutation>;
export type UpdateMeMutationOptions = Apollo.BaseMutationOptions<UpdateMeMutation, UpdateMeMutationVariables>;
export const UploadImageDocument = gql`
    mutation UploadImage($file: Upload!) {
  uploadImage(file: $file) {
    url
  }
}
    `;
export type UploadImageMutationFn = Apollo.MutationFunction<UploadImageMutation, UploadImageMutationVariables>;

/**
 * __useUploadImageMutation__
 *
 * To run a mutation, you first call `useUploadImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadImageMutation, { data, loading, error }] = useUploadImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadImageMutation, UploadImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadImageMutation, UploadImageMutationVariables>(UploadImageDocument, options);
      }
export type UploadImageMutationHookResult = ReturnType<typeof useUploadImageMutation>;
export type UploadImageMutationResult = Apollo.MutationResult<UploadImageMutation>;
export type UploadImageMutationOptions = Apollo.BaseMutationOptions<UploadImageMutation, UploadImageMutationVariables>;
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
export const BlockingUsersDocument = gql`
    query BlockingUsers {
  blockingUsers {
    ...UserParts
  }
}
    ${UserPartsFragmentDoc}`;

/**
 * __useBlockingUsersQuery__
 *
 * To run a query within a React component, call `useBlockingUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockingUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockingUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useBlockingUsersQuery(baseOptions?: Apollo.QueryHookOptions<BlockingUsersQuery, BlockingUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlockingUsersQuery, BlockingUsersQueryVariables>(BlockingUsersDocument, options);
      }
export function useBlockingUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockingUsersQuery, BlockingUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlockingUsersQuery, BlockingUsersQueryVariables>(BlockingUsersDocument, options);
        }
export type BlockingUsersQueryHookResult = ReturnType<typeof useBlockingUsersQuery>;
export type BlockingUsersLazyQueryHookResult = ReturnType<typeof useBlockingUsersLazyQuery>;
export type BlockingUsersQueryResult = Apollo.QueryResult<BlockingUsersQuery, BlockingUsersQueryVariables>;
export const FollowsDocument = gql`
    query Follows($cursor: String, $q: String) {
  follows(first: 30, after: $cursor, q: $q) {
    edges {
      node {
        follow
        ...UserParts
      }
      cursor
    }
    pageInfo {
      ...PageInfoParts
    }
  }
}
    ${UserPartsFragmentDoc}
${PageInfoPartsFragmentDoc}`;

/**
 * __useFollowsQuery__
 *
 * To run a query within a React component, call `useFollowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFollowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFollowsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      q: // value for 'q'
 *   },
 * });
 */
export function useFollowsQuery(baseOptions?: Apollo.QueryHookOptions<FollowsQuery, FollowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FollowsQuery, FollowsQueryVariables>(FollowsDocument, options);
      }
export function useFollowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FollowsQuery, FollowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FollowsQuery, FollowsQueryVariables>(FollowsDocument, options);
        }
export type FollowsQueryHookResult = ReturnType<typeof useFollowsQuery>;
export type FollowsLazyQueryHookResult = ReturnType<typeof useFollowsLazyQuery>;
export type FollowsQueryResult = Apollo.QueryResult<FollowsQuery, FollowsQueryVariables>;
export const GetActiveDataDocument = gql`
    query GetActiveData {
  thoughtTalkRooms: thoughtTalkRooms {
    ...ThoughtTalkRoomParts
  }
}
    ${ThoughtTalkRoomPartsFragmentDoc}`;

/**
 * __useGetActiveDataQuery__
 *
 * To run a query within a React component, call `useGetActiveDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActiveDataQuery(baseOptions?: Apollo.QueryHookOptions<GetActiveDataQuery, GetActiveDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveDataQuery, GetActiveDataQueryVariables>(GetActiveDataDocument, options);
      }
export function useGetActiveDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveDataQuery, GetActiveDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveDataQuery, GetActiveDataQueryVariables>(GetActiveDataDocument, options);
        }
export type GetActiveDataQueryHookResult = ReturnType<typeof useGetActiveDataQuery>;
export type GetActiveDataLazyQueryHookResult = ReturnType<typeof useGetActiveDataLazyQuery>;
export type GetActiveDataQueryResult = Apollo.QueryResult<GetActiveDataQuery, GetActiveDataQueryVariables>;
export const GetNewsTalkRoomMessagesDocument = gql`
    query GetNewsTalkRoomMessages($talkRoomId: Int!, $messageCursor: String) {
  newsTalkRoom(id: $talkRoomId) {
    id
    messages(first: 20, after: $messageCursor) {
      edges {
        node {
          ...NewsTalkRoomMessageParts
        }
        cursor
      }
      pageInfo {
        ...PageInfoParts
      }
    }
  }
}
    ${NewsTalkRoomMessagePartsFragmentDoc}
${PageInfoPartsFragmentDoc}`;

/**
 * __useGetNewsTalkRoomMessagesQuery__
 *
 * To run a query within a React component, call `useGetNewsTalkRoomMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNewsTalkRoomMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewsTalkRoomMessagesQuery({
 *   variables: {
 *      talkRoomId: // value for 'talkRoomId'
 *      messageCursor: // value for 'messageCursor'
 *   },
 * });
 */
export function useGetNewsTalkRoomMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetNewsTalkRoomMessagesQuery, GetNewsTalkRoomMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNewsTalkRoomMessagesQuery, GetNewsTalkRoomMessagesQueryVariables>(GetNewsTalkRoomMessagesDocument, options);
      }
export function useGetNewsTalkRoomMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNewsTalkRoomMessagesQuery, GetNewsTalkRoomMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNewsTalkRoomMessagesQuery, GetNewsTalkRoomMessagesQueryVariables>(GetNewsTalkRoomMessagesDocument, options);
        }
export type GetNewsTalkRoomMessagesQueryHookResult = ReturnType<typeof useGetNewsTalkRoomMessagesQuery>;
export type GetNewsTalkRoomMessagesLazyQueryHookResult = ReturnType<typeof useGetNewsTalkRoomMessagesLazyQuery>;
export type GetNewsTalkRoomMessagesQueryResult = Apollo.QueryResult<GetNewsTalkRoomMessagesQuery, GetNewsTalkRoomMessagesQueryVariables>;
export const GetNewsTalkRoomsDocument = gql`
    query GetNewsTalkRooms {
  newsTalkRooms {
    ...NewsTalkRoomParts
  }
}
    ${NewsTalkRoomPartsFragmentDoc}`;

/**
 * __useGetNewsTalkRoomsQuery__
 *
 * To run a query within a React component, call `useGetNewsTalkRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNewsTalkRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewsTalkRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNewsTalkRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetNewsTalkRoomsQuery, GetNewsTalkRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNewsTalkRoomsQuery, GetNewsTalkRoomsQueryVariables>(GetNewsTalkRoomsDocument, options);
      }
export function useGetNewsTalkRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNewsTalkRoomsQuery, GetNewsTalkRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNewsTalkRoomsQuery, GetNewsTalkRoomsQueryVariables>(GetNewsTalkRoomsDocument, options);
        }
export type GetNewsTalkRoomsQueryHookResult = ReturnType<typeof useGetNewsTalkRoomsQuery>;
export type GetNewsTalkRoomsLazyQueryHookResult = ReturnType<typeof useGetNewsTalkRoomsLazyQuery>;
export type GetNewsTalkRoomsQueryResult = Apollo.QueryResult<GetNewsTalkRoomsQuery, GetNewsTalkRoomsQueryVariables>;
export const GetThoughtTalkRoomMembersDocument = gql`
    query GetThoughtTalkRoomMembers($talkRoomId: Int!, $after: String) {
  thoughtTalkRoom(id: $talkRoomId) {
    id
    members(first: 20, after: $after) {
      edges {
        node {
          id
          user {
            ...UserParts
          }
        }
        cursor
      }
      pageInfo {
        ...PageInfoParts
      }
    }
  }
}
    ${UserPartsFragmentDoc}
${PageInfoPartsFragmentDoc}`;

/**
 * __useGetThoughtTalkRoomMembersQuery__
 *
 * To run a query within a React component, call `useGetThoughtTalkRoomMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThoughtTalkRoomMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThoughtTalkRoomMembersQuery({
 *   variables: {
 *      talkRoomId: // value for 'talkRoomId'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetThoughtTalkRoomMembersQuery(baseOptions: Apollo.QueryHookOptions<GetThoughtTalkRoomMembersQuery, GetThoughtTalkRoomMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThoughtTalkRoomMembersQuery, GetThoughtTalkRoomMembersQueryVariables>(GetThoughtTalkRoomMembersDocument, options);
      }
export function useGetThoughtTalkRoomMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThoughtTalkRoomMembersQuery, GetThoughtTalkRoomMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThoughtTalkRoomMembersQuery, GetThoughtTalkRoomMembersQueryVariables>(GetThoughtTalkRoomMembersDocument, options);
        }
export type GetThoughtTalkRoomMembersQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomMembersQuery>;
export type GetThoughtTalkRoomMembersLazyQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomMembersLazyQuery>;
export type GetThoughtTalkRoomMembersQueryResult = Apollo.QueryResult<GetThoughtTalkRoomMembersQuery, GetThoughtTalkRoomMembersQueryVariables>;
export const GetThoughtTalkRoomMessagesDocument = gql`
    query GetThoughtTalkRoomMessages($id: Int!, $messageCursor: String) {
  thoughtTalkRoom(id: $id) {
    id
    messages(first: 20, after: $messageCursor) {
      edges {
        node {
          ...ThoughtTalkRoomMessageParts
        }
        cursor
      }
      pageInfo {
        ...PageInfoParts
      }
    }
  }
}
    ${ThoughtTalkRoomMessagePartsFragmentDoc}
${PageInfoPartsFragmentDoc}`;

/**
 * __useGetThoughtTalkRoomMessagesQuery__
 *
 * To run a query within a React component, call `useGetThoughtTalkRoomMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThoughtTalkRoomMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThoughtTalkRoomMessagesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      messageCursor: // value for 'messageCursor'
 *   },
 * });
 */
export function useGetThoughtTalkRoomMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetThoughtTalkRoomMessagesQuery, GetThoughtTalkRoomMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThoughtTalkRoomMessagesQuery, GetThoughtTalkRoomMessagesQueryVariables>(GetThoughtTalkRoomMessagesDocument, options);
      }
export function useGetThoughtTalkRoomMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThoughtTalkRoomMessagesQuery, GetThoughtTalkRoomMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThoughtTalkRoomMessagesQuery, GetThoughtTalkRoomMessagesQueryVariables>(GetThoughtTalkRoomMessagesDocument, options);
        }
export type GetThoughtTalkRoomMessagesQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomMessagesQuery>;
export type GetThoughtTalkRoomMessagesLazyQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomMessagesLazyQuery>;
export type GetThoughtTalkRoomMessagesQueryResult = Apollo.QueryResult<GetThoughtTalkRoomMessagesQuery, GetThoughtTalkRoomMessagesQueryVariables>;
export const GetThoughtTalkRoomsDocument = gql`
    query GetThoughtTalkRooms {
  thoughtTalkRooms {
    ...ThoughtTalkRoomParts
  }
}
    ${ThoughtTalkRoomPartsFragmentDoc}`;

/**
 * __useGetThoughtTalkRoomsQuery__
 *
 * To run a query within a React component, call `useGetThoughtTalkRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThoughtTalkRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThoughtTalkRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetThoughtTalkRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetThoughtTalkRoomsQuery, GetThoughtTalkRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThoughtTalkRoomsQuery, GetThoughtTalkRoomsQueryVariables>(GetThoughtTalkRoomsDocument, options);
      }
export function useGetThoughtTalkRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThoughtTalkRoomsQuery, GetThoughtTalkRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThoughtTalkRoomsQuery, GetThoughtTalkRoomsQueryVariables>(GetThoughtTalkRoomsDocument, options);
        }
export type GetThoughtTalkRoomsQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomsQuery>;
export type GetThoughtTalkRoomsLazyQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomsLazyQuery>;
export type GetThoughtTalkRoomsQueryResult = Apollo.QueryResult<GetThoughtTalkRoomsQuery, GetThoughtTalkRoomsQueryVariables>;
export const GetThoughtTalkRoomParentDocument = gql`
    query GetThoughtTalkRoomParent($id: Int!) {
  thoughtTalkRoom(id: $id) {
    id
    thought {
      ...ThoughtTalkRoomParentParts
    }
  }
}
    ${ThoughtTalkRoomParentPartsFragmentDoc}`;

/**
 * __useGetThoughtTalkRoomParentQuery__
 *
 * To run a query within a React component, call `useGetThoughtTalkRoomParentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThoughtTalkRoomParentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThoughtTalkRoomParentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetThoughtTalkRoomParentQuery(baseOptions: Apollo.QueryHookOptions<GetThoughtTalkRoomParentQuery, GetThoughtTalkRoomParentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThoughtTalkRoomParentQuery, GetThoughtTalkRoomParentQueryVariables>(GetThoughtTalkRoomParentDocument, options);
      }
export function useGetThoughtTalkRoomParentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThoughtTalkRoomParentQuery, GetThoughtTalkRoomParentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThoughtTalkRoomParentQuery, GetThoughtTalkRoomParentQueryVariables>(GetThoughtTalkRoomParentDocument, options);
        }
export type GetThoughtTalkRoomParentQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomParentQuery>;
export type GetThoughtTalkRoomParentLazyQueryHookResult = ReturnType<typeof useGetThoughtTalkRoomParentLazyQuery>;
export type GetThoughtTalkRoomParentQueryResult = Apollo.QueryResult<GetThoughtTalkRoomParentQuery, GetThoughtTalkRoomParentQueryVariables>;
export const InitialDataDocument = gql`
    query InitialData {
  me: me {
    id
    name
    bio
    imageUrl
    facebook
    twitter
    instagram
    linkedin
  }
  thoughtTalkRooms: thoughtTalkRooms {
    ...ThoughtTalkRoomParts
  }
  newsTalkRooms: newsTalkRooms {
    ...NewsTalkRoomParts
  }
}
    ${ThoughtTalkRoomPartsFragmentDoc}
${NewsTalkRoomPartsFragmentDoc}`;

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
    instagram
    linkedin
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
  news(genre: $genre, first: 20, after: $cursor) {
    ...NewsConnectionParts
  }
}
    ${NewsConnectionPartsFragmentDoc}`;

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
export const PickedThoughtsDocument = gql`
    query PickedThoughts($cursor: String) {
  pickedThoughts(first: 20, after: $cursor) {
    ...ThoughtsConnectionParts
  }
}
    ${ThoughtsConnectionPartsFragmentDoc}`;

/**
 * __usePickedThoughtsQuery__
 *
 * To run a query within a React component, call `usePickedThoughtsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePickedThoughtsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePickedThoughtsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePickedThoughtsQuery(baseOptions?: Apollo.QueryHookOptions<PickedThoughtsQuery, PickedThoughtsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PickedThoughtsQuery, PickedThoughtsQueryVariables>(PickedThoughtsDocument, options);
      }
export function usePickedThoughtsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PickedThoughtsQuery, PickedThoughtsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PickedThoughtsQuery, PickedThoughtsQueryVariables>(PickedThoughtsDocument, options);
        }
export type PickedThoughtsQueryHookResult = ReturnType<typeof usePickedThoughtsQuery>;
export type PickedThoughtsLazyQueryHookResult = ReturnType<typeof usePickedThoughtsLazyQuery>;
export type PickedThoughtsQueryResult = Apollo.QueryResult<PickedThoughtsQuery, PickedThoughtsQueryVariables>;
export const ThoughtsDocument = gql`
    query Thoughts($genre: Genre, $cursor: String, $follow: Boolean) {
  thoughts(genre: $genre, first: 20, after: $cursor, follow: $follow) {
    ...ThoughtsConnectionParts
  }
}
    ${ThoughtsConnectionPartsFragmentDoc}`;

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
 *      follow: // value for 'follow'
 *   },
 * });
 */
export function useThoughtsQuery(baseOptions?: Apollo.QueryHookOptions<ThoughtsQuery, ThoughtsQueryVariables>) {
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
export const UserDocument = gql`
    query User($id: ID!) {
  user(id: $id) {
    ...UserParts
    blocking
    follow
  }
}
    ${UserPartsFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const PickedNewsDocument = gql`
    query PickedNews($cursor: String) {
  pickedNews(first: 20, after: $cursor) {
    ...NewsConnectionParts
  }
}
    ${NewsConnectionPartsFragmentDoc}`;

/**
 * __usePickedNewsQuery__
 *
 * To run a query within a React component, call `usePickedNewsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePickedNewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePickedNewsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePickedNewsQuery(baseOptions?: Apollo.QueryHookOptions<PickedNewsQuery, PickedNewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PickedNewsQuery, PickedNewsQueryVariables>(PickedNewsDocument, options);
      }
export function usePickedNewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PickedNewsQuery, PickedNewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PickedNewsQuery, PickedNewsQueryVariables>(PickedNewsDocument, options);
        }
export type PickedNewsQueryHookResult = ReturnType<typeof usePickedNewsQuery>;
export type PickedNewsLazyQueryHookResult = ReturnType<typeof usePickedNewsLazyQuery>;
export type PickedNewsQueryResult = Apollo.QueryResult<PickedNewsQuery, PickedNewsQueryVariables>;
export const UserThoughtsDocument = gql`
    query UserThoughts($userId: ID!, $cursor: String) {
  userThoughts(userId: $userId, first: 20, after: $cursor) {
    ...ThoughtsConnectionParts
  }
}
    ${ThoughtsConnectionPartsFragmentDoc}`;

/**
 * __useUserThoughtsQuery__
 *
 * To run a query within a React component, call `useUserThoughtsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserThoughtsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserThoughtsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useUserThoughtsQuery(baseOptions: Apollo.QueryHookOptions<UserThoughtsQuery, UserThoughtsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserThoughtsQuery, UserThoughtsQueryVariables>(UserThoughtsDocument, options);
      }
export function useUserThoughtsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserThoughtsQuery, UserThoughtsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserThoughtsQuery, UserThoughtsQueryVariables>(UserThoughtsDocument, options);
        }
export type UserThoughtsQueryHookResult = ReturnType<typeof useUserThoughtsQuery>;
export type UserThoughtsLazyQueryHookResult = ReturnType<typeof useUserThoughtsLazyQuery>;
export type UserThoughtsQueryResult = Apollo.QueryResult<UserThoughtsQuery, UserThoughtsQueryVariables>;
export const OnNewsTalkRoomMessageCreatedDocument = gql`
    subscription OnNewsTalkRoomMessageCreated($roomIds: [Int]!, $userId: ID!) {
  newsTalkRoomMessageCreated(roomIds: $roomIds, userId: $userId) {
    ...NewsTalkRoomMessageParts
  }
}
    ${NewsTalkRoomMessagePartsFragmentDoc}`;

/**
 * __useOnNewsTalkRoomMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useOnNewsTalkRoomMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewsTalkRoomMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewsTalkRoomMessageCreatedSubscription({
 *   variables: {
 *      roomIds: // value for 'roomIds'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useOnNewsTalkRoomMessageCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnNewsTalkRoomMessageCreatedSubscription, OnNewsTalkRoomMessageCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewsTalkRoomMessageCreatedSubscription, OnNewsTalkRoomMessageCreatedSubscriptionVariables>(OnNewsTalkRoomMessageCreatedDocument, options);
      }
export type OnNewsTalkRoomMessageCreatedSubscriptionHookResult = ReturnType<typeof useOnNewsTalkRoomMessageCreatedSubscription>;
export type OnNewsTalkRoomMessageCreatedSubscriptionResult = Apollo.SubscriptionResult<OnNewsTalkRoomMessageCreatedSubscription>;
export const OnThoughtTalkRoomMessageCreatedDocument = gql`
    subscription OnThoughtTalkRoomMessageCreated($roomIds: [Int]!, $userId: ID!) {
  thoughtTalkRoomMessageCreated(roomIds: $roomIds, userId: $userId) {
    talkRoom {
      id
      updatedAt
      createdAt
      allMessageSeen
      thought {
        id
        title
        text
        contributor {
          id
          name
          imageUrl
        }
      }
    }
    ...ThoughtTalkRoomMessageParts
  }
}
    ${ThoughtTalkRoomMessagePartsFragmentDoc}`;

/**
 * __useOnThoughtTalkRoomMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useOnThoughtTalkRoomMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnThoughtTalkRoomMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnThoughtTalkRoomMessageCreatedSubscription({
 *   variables: {
 *      roomIds: // value for 'roomIds'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useOnThoughtTalkRoomMessageCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnThoughtTalkRoomMessageCreatedSubscription, OnThoughtTalkRoomMessageCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnThoughtTalkRoomMessageCreatedSubscription, OnThoughtTalkRoomMessageCreatedSubscriptionVariables>(OnThoughtTalkRoomMessageCreatedDocument, options);
      }
export type OnThoughtTalkRoomMessageCreatedSubscriptionHookResult = ReturnType<typeof useOnThoughtTalkRoomMessageCreatedSubscription>;
export type OnThoughtTalkRoomMessageCreatedSubscriptionResult = Apollo.SubscriptionResult<OnThoughtTalkRoomMessageCreatedSubscription>;
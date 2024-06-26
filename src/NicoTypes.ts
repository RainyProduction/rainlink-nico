// Code from:
// https://github.com/y-chan/niconico-dl.js

export interface NiconicoAPIData {
  media: {
    delivery: {
      movie: {
        session: {
          videos: string[];
          audios: string[];
          heartbeatLifetime: number;
          recipeId: string;
          priority: number;
          urls: {
            isWellKnownPort: boolean;
            isSsl: boolean;
            [key: string]: any;
          }[];
          token: string;
          signature: string;
          contentId: string;
          authTypes: {
            http: string;
          };
          contentKeyTimeout: number;
          serviceUserId: string;
          playerId: string;
          [key: string]: any;
        };
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  video: OriginalVideoInfo;
  owner: OwnerInfo;
  [key: string]: any;
}

export interface OwnerInfo {
  id: number;
  nickname: string;
  iconUrl: string;
  channel: string | null;
  live: {
    id: string;
    title: string;
    url: string;
    begunAt: string;
    isVideoLive: boolean;
    videoLiveOnAirStartTime: string | null;
    thumbnailUrl: string | null;
  } | null;
  isVideoPublic: boolean;
  isMylistsPublic: boolean;
  videoLiveNotice: null;
  viewer: number | null;
}

export interface OriginalVideoInfo {
  id: string;
  title: string;
  description: string;
  count: {
    view: number;
    comment: number;
    mylist: number;
    like: number;
  };
  duration: number;
  thumbnail: {
    url: string;
    middleUrl: string;
    largeUrl: string;
    player: string;
    ogp: string;
  };
  rating: {
    isAdult: boolean;
  };
  registerdAt: string;
  isPrivate: boolean;
  isDeleted: boolean;
  isNoBanner: boolean;
  isAuthenticationRequired: boolean;
  isEmbedPlayerAllowed: boolean;
  viewer: null;
  watchableUserTypeForPayment: string;
  commentableUserTypeForPayment: string;
  [key: string]: any;
}

export interface VideoInfo extends OriginalVideoInfo {
  owner: OwnerInfo;
}

// Code from:
// https://github.com/blackrose514/niconico-search-api

export interface SearchAPIResponse<F extends SearchParams['fields']> {
  meta: {
    id: string;
    status: number;
    totalCount: number;
  };
  data: ResponseData<F>;
}

export interface ErrorResponse {
  meta: {
    id: string;
    status: number;
    errorCode: string;
    errorMessage: string;
  };
}

export type ResponseData<F extends SearchParams['fields']> = F extends '*'
  ? Omit<Fields, 'tagsExact'>[]
  : F extends ResponseField[]
    ? Pick<Fields, F[number]>[]
    : never;

export interface SearchParams {
  q: string;
  targets: Target[];
  fields?: ResponseField[] | '*';
  filters?: JsonFilter;
  sort: Sort;
  offset?: number;
  limit?: number;
  context?: string;
}

export type Target = 'title' | 'description' | 'tags' | 'tagsExact';
export type FilterField = Exclude<
  keyof Fields,
  'contentId' | 'title' | 'description' | 'thumbnailUrl' | 'lastResBody'
>;
export type ResponseField = Exclude<keyof Fields, 'tagsExact'>;
export type JsonFilter = EqualFilter | RangeFilter | AndFilter | OrFilter | NotFilter;
export type Sort = `${'+' | '-'}${
  | 'viewCounter'
  | 'mylistCounter'
  | 'lengthSeconds'
  | 'startTime'
  | 'commentCounter'
  | 'lastCommentTime'}`;
export interface Fields {
  contentId: string;
  title: string;
  description: string;
  viewCounter: number;
  mylistCounter: number;
  lengthSeconds: number;
  thumbnailUrl: string;
  startTime: string;
  lastResBody: string;
  commentCounter: number;
  lastCommentTime: string;
  categoryTags: string;
  tags: string;
  tagsExact: string;
  genre: string;
  // 'genre.keyword': string
}
export interface EqualFilter {
  type: 'equal';
  field: FilterField;
  value: string | number;
}

export interface RangeFilter {
  type: 'range';
  field: FilterField;
  from?: string | number;
  to?: string | number;
  include_lower?: boolean;
  include_upper?: boolean;
}

export interface AndFilter {
  type: 'and';
  filters: JsonFilter[];
}

export interface OrFilter {
  type: 'or';
  filters: JsonFilter[];
}

export interface NotFilter {
  type: 'not';
  filter: JsonFilter;
}
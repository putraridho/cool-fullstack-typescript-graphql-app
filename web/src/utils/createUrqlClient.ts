import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import gql from "graphql-tag";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import Router from "next/router";
import { writeFragment } from "@urql/exchange-graphcache/dist/types/operations";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          vote: (_result, _args, _cache) => {
            const { postId, value } = _args as VoteMutationVariables;
            const data = _cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                  voteStatus
                }
              `,
              { id: postId } as any
            );

            if (data) {
              if (data.voteStatus === value) return;
              const newPoints =
                (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
              _cache.writeFragment(
                gql`
                  fragment _ on Post {
                    points
                    voteStatus
                  }
                `,
                { id: postId, points: newPoints, voteStatus: value } as any
              );
            }
          },
          createPost: (_result, _, _cache) => {
            const allFields = _cache.inspectFields("Query");
            const fieldInfos = allFields.filter(
              (info) => info.fieldName === "posts"
            );
            fieldInfos.forEach((fi) => {
              _cache.invalidate("Query", "posts", fi.arguments || {});
            });
          },
          logout: (_result, _, _cache) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              _cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _, _cache) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              _cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, _, _cache) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              _cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach(({ fieldKey }) => {
      const key = cache.resolveFieldByKey(entityKey, fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    const obj = {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };

    return obj;
  };
};

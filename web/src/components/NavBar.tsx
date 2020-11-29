import React from "react";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/core";
import NextLink from "next/link";
// import { useRouter } from "next/router";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

function NavBar({}: NavBarProps): React.ReactElement {
  // const router = useRouter();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex alignItems="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={2}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          variant="link"
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex position="sticky" top={0} bg="tan" padding={4} zIndex={10}>
      <Flex flex={1} mx="auto" maxWidth={800} alignItems="center">
        <NextLink href="/">
          <Link>
            <Heading>LiRedis</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
}

export default NavBar;

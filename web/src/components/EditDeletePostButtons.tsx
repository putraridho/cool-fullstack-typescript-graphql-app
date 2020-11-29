import { Box, IconButton, Link } from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useDeleteMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export default function EditDeletePostButtons({
  id,
  creatorId,
}: EditDeletePostButtonsProps): React.ReactElement {
  const [deletePost] = useDeleteMutation();
  const { data: meData } = useMeQuery();

  if (meData?.me?.id !== creatorId) {
    return <></>;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton mr={4} as={Link} icon="edit" aria-label="Edit Post" />
      </NextLink>
      <IconButton
        icon="delete"
        aria-label="Delete Post"
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => cache.evict({ id: "Post:" + id }),
          });
        }}
      />
    </Box>
  );
}

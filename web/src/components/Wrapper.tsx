import { Box } from "@chakra-ui/core";
import React from "react";

interface WrapperProps {
  children: JSX.Element;
  variant?: "small" | "regular";
}

export default function Wrapper({
  children,
  variant = "regular",
}: WrapperProps): React.ReactElement {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
      paddingLeft="20px"
      paddingRight="20px"
    >
      {children}
    </Box>
  );
}

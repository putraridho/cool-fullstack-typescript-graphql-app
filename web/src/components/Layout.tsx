import React from "react";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface LayoutProps {
  children: React.ReactNode;
  variant?: WrapperVariant;
}

export default function Layout({
  children,
  variant,
}: LayoutProps): React.ReactElement {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
}

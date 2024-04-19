import React from "react";
import AuthenticatedProvider from "../providers/AuthenticatedProvider";

export default function MyLibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedProvider>{children}</AuthenticatedProvider>;
}

import React from "react";
import { Layout, LayoutProps } from "react-admin";
// import { TransbaseAppBar } from "./AppBar";
import { TransbaseAppMenu } from "./AppMenu";

export function TransbaseAdminLayout(props: LayoutProps) {
  return (
    <Layout
      {...props}
      // appBar={TransbaseAppBar}
      menu={TransbaseAppMenu}
    />
  );
}

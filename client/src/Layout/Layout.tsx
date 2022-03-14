import React from "react";
import { Layout } from "react-admin";
import { TransbaseAppBar } from "./AppBar";
import { TransbaseAppMenu } from "./AppMenu";

export function TransbaseAdminLayout(props) {
  return (
    <Layout
      {...props}
      appBar={TransbaseAppBar}
      //menu={TransbaseAppMenu}
    />
  );
}

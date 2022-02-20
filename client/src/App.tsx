import * as React from "react";
import { render } from "react-dom";
import { AdminContext } from "react-admin";
import restProvider from "./provider/api";
import authProvider from "./provider/auth";
import { Resources } from "./Resource/Resources";
import "./app.css";

render(
  <AdminContext authProvider={authProvider} dataProvider={restProvider()}>
    <Resources />
  </AdminContext>,
  document.getElementById("root")
);

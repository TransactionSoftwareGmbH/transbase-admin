import * as React from "react";
import { render } from "react-dom";
import { AdminContext, Login } from "react-admin";
import restProvider from "./provider/api";
import authProvider from "./provider/auth";
import { Resources } from "./Resource/Resources";
import "./app.css";
import { theme } from "./Layout/theme";

render(
  <AdminContext
    theme={theme}
    authProvider={authProvider}
    dataProvider={restProvider()}
  >
    <Resources />
  </AdminContext>,
  document.getElementById("root")
);

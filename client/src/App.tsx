import * as React from "react";
import { render } from "react-dom";
import { AdminContext } from "react-admin";
import { dataProvider } from "./provider/api";
import { authProvider } from "./provider/auth";
import { theme } from "./Layout/theme";
import { TransbaseAdmin } from "./TransbaseAdmin";
import "./app.css";

render(
  <AdminContext
    theme={theme}
    authProvider={authProvider}
    dataProvider={dataProvider()}
  >
    <TransbaseAdmin />
  </AdminContext>,
  document.getElementById("root")
);

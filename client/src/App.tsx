import * as React from "react";
import { render } from "react-dom";
import { AdminContext } from "react-admin";
import restProvider from "./provider/api";
import { Resources } from "./Resource/Resources";

render(
  <AdminContext dataProvider={restProvider()}>
    <Resources />
  </AdminContext>,
  document.getElementById("root")
);

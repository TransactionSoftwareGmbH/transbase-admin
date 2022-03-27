import * as React from "react";
import { render } from "react-dom";
import { AdminContext } from "react-admin";
import { dataProvider } from "./provider/api";
import { authProvider } from "./provider/auth";
import { theme } from "./Layout/theme";
import { TransbaseAdmin } from "./TransbaseAdmin";
import polyglotI18nProvider from "ra-i18n-polyglot";
import TransbaseMessages from "../i18n/transbase.json";
import english from "ra-language-english";

const i18nProvider = polyglotI18nProvider(
  () => ({ ...english, ...TransbaseMessages }),
  "en"
);
import "./app.css";

render(
  <AdminContext
    theme={theme}
    authProvider={authProvider}
    dataProvider={dataProvider()}
    i18nProvider={i18nProvider}
  >
    <TransbaseAdmin />
  </AdminContext>,
  document.getElementById("root")
);

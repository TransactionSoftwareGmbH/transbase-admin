import polyglotI18nProvider from "ra-i18n-polyglot";
import english from "ra-language-english";
import * as React from "react";
import { Admin } from "react-admin";
import { render } from "react-dom";
import TransbaseMessages from "../i18n/transbase.json";
import "./app.css";
import { TransbaseLogin } from "./Layout/Login";
import { theme } from "./Layout/theme";
import { dataProvider } from "./provider/api";
import { authProvider } from "./provider/auth";
import { fetchTransbaseAdminResources } from "./TransbaseAdmin";

const i18nProvider = polyglotI18nProvider(
  () => ({ ...english, ...TransbaseMessages }),
  "en"
);

render(
  <Admin
    theme={theme}
    authProvider={authProvider}
    dataProvider={dataProvider()}
    i18nProvider={i18nProvider}
    loginPage={TransbaseLogin}
    requireAuth={true}
  >
    {fetchTransbaseAdminResources}
  </Admin>,
  document.getElementById("root")
);

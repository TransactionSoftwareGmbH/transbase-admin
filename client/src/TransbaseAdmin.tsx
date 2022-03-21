import React from "react";
import { TransbaseAdminLayout } from "./Layout/Layout";
import { theme } from "./Layout/theme";
import { TransbaseLogin } from "./Layout/Login";
import { AdminUI, Resource } from "react-admin";
import { DatabaseList } from "./Resource/Database";
import Code from "@material-ui/icons/Code";
import { CreateRow, ResourceTable, useTableIntrospect } from "./Resource/Table";
import { SqlQuery } from "./Resource/SqlQuery";

export function TransbaseAdmin() {
  const { tables } = useTableIntrospect();
  return (
    <AdminUI
      theme={theme}
      layout={TransbaseAdminLayout}
      loginPage={TransbaseLogin}
    >
      {/* <Resource name="users" list={ResourceTable} /> */}
      <Resource name="databases" list={DatabaseList} />
      {tables.map(({ name }) => (
        <Resource
          key={name}
          name={name}
          list={ResourceTable}
          create={CreateRow}
        />
      ))}
      <Resource icon={Code} name="sql" list={SqlQuery} />
    </AdminUI>
  );
}

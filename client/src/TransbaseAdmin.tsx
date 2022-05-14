import Terminal from "@mui/icons-material/Terminal";
import StorageRounded from "@mui/icons-material/StorageRounded";
import Person from "@mui/icons-material/Person";
import React from "react";
import { Resource } from "react-admin";
import { dataProvider } from "./provider/api";
import { DatabaseList } from "./Resource/Database";
import { SqlQuery } from "./Resource/SqlQuery";
import { TableResource } from "./Resource/Table";
import { UserList } from "./Resource/User";

export async function fetchTransbaseAdminResources() {
  const provider = dataProvider();
  const schema = await provider.introspect().then((it) => it.data);
  return [
    <Resource icon={StorageRounded} name="databases" list={DatabaseList} />,
    <Resource icon={Person} name="user" list={UserList} />,
    ...schema.map(TableResource),
    <Resource
      icon={Terminal}
      name="sql"
      list={SqlQuery}
      options={{ singular: true }}
    />,
  ];
}

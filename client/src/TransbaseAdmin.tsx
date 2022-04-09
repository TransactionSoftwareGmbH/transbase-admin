import Code from "@mui/icons-material/Code";
import React from "react";
import { Resource } from "react-admin";
import { dataProvider } from "./provider/api";
import { DatabaseList } from "./Resource/Database";
import { SqlQuery } from "./Resource/SqlQuery";
import { TableResource } from "./Resource/Table";

export async function fetchTransbaseAdminResources() {
  const provider = dataProvider();
  const schema = await provider.introspect().then((it) => it.data);
  return [
    <Resource name="databases" list={DatabaseList} />,
    ...schema.map(TableResource),
    <Resource icon={Code} name="sql" list={SqlQuery} />,
  ];
}

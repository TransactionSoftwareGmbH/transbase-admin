import React from "react";
import {
  Button,
  Datagrid,
  List,
  Resource,
  TextField,
  useRecordContext,
} from "react-admin";
import OpenInNew from "@mui/icons-material/OpenInNew";
import StorageRounded from "@mui/icons-material/StorageRounded";

export function DatabaseResource() {
  return (
    <Resource
      key="database"
      icon={StorageRounded}
      name="databases"
      list={DatabaseList}
    />
  );
}

function DatabaseList() {
  return (
    <List>
      <Datagrid>
        <TextField source="name" />
        <Connect />
      </Datagrid>
    </List>
  );
}

function Connect() {
  const record = useRecordContext();
  return (
    <Button
      onClick={() => console.log("connect to", record.id)}
      icon={<OpenInNew />}
      label="Connect"
    />
  );
}

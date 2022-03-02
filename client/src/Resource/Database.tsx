import React from "react";
import {
  Button,
  Datagrid,
  List,
  TextField,
  useRecordContext,
} from "react-admin";
import OpenInNew from "@material-ui/icons/OpenInNew";

export function DatabaseList(props) {
  return (
    <List {...props}>
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

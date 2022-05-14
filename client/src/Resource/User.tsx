import React from "react";
import { Datagrid, List, TextField } from "react-admin";

export function UserList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="username" />
        <TextField source="userclass" />
        <TextField source="passwd" />
      </Datagrid>
    </List>
  );
}

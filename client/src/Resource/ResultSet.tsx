import React from "react";
import { Datagrid, NumberField, TextField } from "react-admin";
import { TableSchema } from "../types";

export function ResultSet({ schema }: { schema?: TableSchema }) {
  if (!schema) {
    return null;
  }
  return (
    <Datagrid>
      {schema?.columns.map(({ name, typeName }) => {
        switch (typeName) {
          case "INTEGER":
            return <NumberField key={name} source={name} />;
          case "VARCHAR":
          default:
            return <TextField key={name} source={name} />;
        }
      })}
    </Datagrid>
  );
}

import React from "react";
import { Datagrid, NumberField, TextField } from "react-admin";

export function ResultSet({ schema }) {
  if (!schema) {
    return null;
  }
  return (
    <Datagrid>
      {schema.map(({ name, typeName }) => {
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

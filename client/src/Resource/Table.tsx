import React from "react";
import {
  Datagrid,
  List,
  NumberField,
  TextField,
  useDataProvider,
} from "react-admin";

export const ResourceTable = (props) => (
  <List {...props}>
    <Table name={props.resource} />
  </List>
);

function Table({ name }: { name: string }) {
  const provider = useDataProvider();
  const [schema, setSchema] = React.useState<any[]>();
  React.useEffect(() => {
    provider.getSchema(name).then(({ data }) => setSchema(data));
  }, []);

  return <ResultSet schema={schema} />;
}

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

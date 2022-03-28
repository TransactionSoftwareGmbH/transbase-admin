import React from "react";
import {
  Create,
  DateInput,
  Edit,
  List,
  NumberInput,
  Resource,
  SimpleForm,
  TextInput,
  useAuthState,
  useDataProvider,
  useResourceDefinition,
} from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import { ResultSet } from "./ResultSet";

export function TableResource({ name }: { name: string }) {
  return (
    <Resource
      key={name}
      name={name}
      list={Table}
      create={CreateRow}
      edit={EditRow}
    />
  );
}

function Table() {
  return (
    <List>
      <TableData />
    </List>
  );
}

function TableData() {
  const { name } = useResourceDefinition();
  console.log("name", name);
  const schema = useSchema(name);
  return <ResultSet schema={schema} />;
}

function CreateRow() {
  return (
    <Create>
      <TableFields />
    </Create>
  );
}

function EditRow() {
  return (
    <Edit>
      <TableFields />
    </Edit>
  );
}

function TableFields() {
  const { name } = useResourceDefinition();
  const schema = useSchema(name);
  return <SimpleForm>{schema?.columns?.map(Field)}</SimpleForm>;
}

function Field({ name, typeName }: { name: string; typeName: string }) {
  const props = { key: name, source: name };
  if (typeName.startsWith("DATE")) {
    return <DateInput {...props} />;
  }
  switch (typeName) {
    case "INTEGER":
      return <NumberInput {...props} />;
    case "VARCHAR":
    default:
      return <TextInput {...props} />;
  }
}

function useSchema(name: string) {
  const provider = useDataProvider<TransbaseDataProvider>();
  const [schema, setSchema] = React.useState<{
    columns: Array<{ name; typeName }>;
    primaryKey: string[];
  }>();
  React.useEffect(() => {
    if (name) {
      provider.getSchema(name).then(({ data }) => setSchema(data));
    }
  }, [name]);
  return schema;
}

export function useTableIntrospect() {
  // FIXME: why is this not called after login??
  const { authenticated } = useAuthState();
  const provider = useDataProvider<TransbaseDataProvider>();
  const [tables, setTables] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (authenticated) {
      provider.introspect().then(({ data }) => setTables(data));
    }
  }, [authenticated]);
  return { tables };
}

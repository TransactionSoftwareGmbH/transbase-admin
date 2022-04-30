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
  useGetIdentity,
  useResourceDefinition,
} from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import { TableSchema } from "../types";
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
  const [schema, setSchema] = React.useState<TableSchema>();
  React.useEffect(() => {
    if (name) {
      provider.getSchema(name).then(({ data }) => setSchema(data));
    }
  }, [name]);
  return schema;
}

export function useTableIntrospect() {
  const { authenticated, isLoading } = useAuthState();
  const re = useGetIdentity();
  console.log(re);
  const ready = authenticated && !isLoading;
  const provider = useDataProvider<TransbaseDataProvider>();
  const [tables, setTables] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (ready) {
      provider.introspect().then((result) => setTables(result?.data || []));
    }
  }, [ready]);
  return { tables, authenticated, isLoading };
}

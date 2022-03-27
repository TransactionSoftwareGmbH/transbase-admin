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

function Table(props) {
  return (
    <List {...props}>
      <TableData name={props.resource} />
    </List>
  );
}

function TableData({ name }: { name: string }) {
  const schema = useSchema(name);
  return <ResultSet schema={schema} />;
}

function CreateRow(props) {
  return (
    <Create {...props}>
      <TableFields {...props} />
    </Create>
  );
}

function EditRow(props) {
  return (
    <Edit {...props}>
      <TableFields {...props} />
    </Edit>
  );
}

function TableFields(props: { resource: string }) {
  const schema = useSchema(props.resource);
  return <SimpleForm>{schema?.map(Field)}</SimpleForm>;
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
  const [schema, setSchema] = React.useState<any[]>();
  React.useEffect(() => {
    provider.getSchema(name).then(({ data }) => setSchema(data));
  }, []);
  return schema;
}

export function useTableIntrospect() {
  // FIXME: why is this not called after login??
  const { authenticated, loaded } = useAuthState();
  const provider = useDataProvider<TransbaseDataProvider>();
  const [tables, setTables] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (loaded && authenticated) {
      provider.introspect().then(({ data }) => setTables(data));
    }
  }, [loaded, authenticated]);
  return { tables };
}

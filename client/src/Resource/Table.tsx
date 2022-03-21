import React from "react";
import {
  Create,
  DateInput,
  List,
  NumberInput,
  SimpleForm,
  TextInput,
  useAuthState,
  useDataProvider,
} from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import { ResultSet } from "./ResultSet";

export const ResourceTable = (props) => (
  <List {...props}>
    <Table name={props.resource} />
  </List>
);

function Table({ name }: { name: string }) {
  const schema = useSchema(name);
  return <ResultSet schema={schema} />;
}

export function CreateRow(props) {
  const schema = useSchema(props.resource);
  return (
    <Create {...props}>
      <SimpleForm>{schema?.map(Field)}</SimpleForm>
    </Create>
  );
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
    console.log({ loaded, authenticated });
    if (loaded && authenticated) {
      console.log("authenticated");
      provider.introspect().then(({ data }) => setTables(data));
    }
  }, [loaded, authenticated]);
  return { tables };
}

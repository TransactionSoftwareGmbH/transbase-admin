import React from "react";
import {
  List,
  useAuthState,
  useCheckAuth,
  useDataProvider,
  useGetIdentity,
} from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import { ResultSet } from "./ResultSet";

export const ResourceTable = (props) => (
  <List {...props}>
    <Table name={props.resource} />
  </List>
);

function Table({ name }: { name: string }) {
  const provider = useDataProvider<TransbaseDataProvider>();
  const [schema, setSchema] = React.useState<any[]>();
  React.useEffect(() => {
    provider.getSchema(name).then(({ data }) => setSchema(data));
  }, []);

  return <ResultSet schema={schema} />;
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

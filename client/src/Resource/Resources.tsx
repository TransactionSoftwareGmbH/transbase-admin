import React from "react";
import { AdminUI, Resource, useDataProvider } from "react-admin";
import { ResourceTable } from "./List";
import { SqlQuery } from "./SqlQuery";
import Code from "@material-ui/icons/Code";

export function Resources() {
  const provider = useDataProvider();
  const [resources, setResources] = React.useState<any[]>([]);
  React.useEffect(() => {
    provider.introspect().then(({ data }) => setResources(data));
  }, []);

  return (
    <AdminUI>
      {/* <Resource name="users" list={ResourceTable} /> */}
      <Resource icon={Code} name="sql" list={SqlQuery} />
      {resources.map(({ tname: name }) => (
        <Resource
          intent="registration"
          key={name}
          name={name}
          list={ResourceTable}
        />
      ))}
    </AdminUI>
  );
}

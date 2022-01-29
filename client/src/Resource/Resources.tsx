import React from "react";
import { AdminUI, Resource, useDataProvider } from "react-admin";
import { ResourceTable } from "./List";

export function Resources() {
  const provider = useDataProvider();
  const [resources, setResources] = React.useState<any[]>([]);
  React.useEffect(() => {
    provider.introspect().then(setResources);
  }, []);

  return (
    <AdminUI>
      <Resource intent="route" name="users" list={ResourceTable} />
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

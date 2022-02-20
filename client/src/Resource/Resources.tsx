import React from "react";
import {
  AdminUI,
  AppBar,
  Layout,
  Resource,
  useAuthState,
  useDataProvider,
} from "react-admin";
import { ResourceTable } from "./List";
import { SqlQuery } from "./SqlQuery";
import Code from "@material-ui/icons/Code";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export function Resources() {
  const { authenticated, loaded } = useAuthState();
  const provider = useDataProvider();
  const [resources, setResources] = React.useState<any[]>([]);
  React.useEffect(() => {
    console.log(loaded, authenticated);
    if (loaded && authenticated) {
      provider.introspect().then(({ data }) => setResources(data));
    }
  }, [loaded, authenticated]);

  return (
    <AdminUI layout={AdminLayout}>
      {/* <Resource name="users" list={ResourceTable} /> */}
      <Resource icon={Code} name="sql" list={SqlQuery} />
      {resources.map(({ name }) => (
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

// TODO
const MyAppBar = (props) => (
  <AppBar {...props}>
    <Box flex="1">
      <Typography variant="h6" id="react-admin-title">
        Transbase Admin
      </Typography>
    </Box>
  </AppBar>
);

const AdminLayout = (props) => <Layout {...props} appBar={MyAppBar} />;

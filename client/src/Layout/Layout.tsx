import React from "react";
import {
  Button,
  DeleteButton,
  Layout,
  LayoutProps,
  SaveButton,
  SimpleForm,
  Toolbar,
} from "react-admin";
// import { TransbaseAppBar } from "./AppBar";
import { TransbaseAppMenu } from "./AppMenu";
import Close from "@mui/icons-material/Close";

export function TransbaseAdminLayout(props: LayoutProps) {
  return (
    <Layout
      {...props}
      // appBar={TransbaseAppBar}
      menu={TransbaseAppMenu}
    />
  );
}

export function TransbaseToolbar() {
  return (
    <Toolbar>
      <SaveButton />
      <Button
        size="medium"
        label="Close"
        alignIcon="left"
        sx={{ marginLeft: "auto", marginRight: "0.5rem" }}
        onClick={() => history.back()}
      >
        <Close />
      </Button>
      <DeleteButton />
    </Toolbar>
  );
}

(SimpleForm as any).defaultProps = { toolbar: <TransbaseToolbar /> };

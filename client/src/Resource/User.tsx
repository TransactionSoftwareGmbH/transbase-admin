import React from "react";
import {
  Button,
  Create,
  Datagrid,
  Edit,
  List,
  PasswordInput,
  RadioButtonGroupInput,
  required,
  Resource,
  SimpleForm,
  TextField,
  TextInput,
} from "react-admin";
import Person from "@mui/icons-material/Person";

export function UserResource() {
  return (
    <Resource
      key="user"
      icon={Person}
      name="user"
      list={UserList}
      create={CreateUser}
      edit={EditUser}
    />
  );
}

function UserList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="username" />
        <TextField source="userclass" />
        <TextField source="passwd" />
      </Datagrid>
    </List>
  );
}

function CreateUser() {
  return (
    <>
      <Create title="Create new user">
        <SimpleForm validate={checkPassword}>
          <TextInput
            source="username"
            autoFocus
            validate={required("Required field")}
          />
          <RadioButtonGroupInput
            defaultValue="access"
            source="userclass"
            choices={[
              { id: "access", name: "access" },
              { id: "resource", name: "resource" },
              { id: "dba", name: "dba" },
            ]}
          />
          <PasswordInput source="password" />
          <PasswordInput source="repeat_password" />
        </SimpleForm>
      </Create>
    </>
  );
}

function EditUser() {
  const [changePassword, setChangePassword] = React.useState(false);
  return (
    <Edit
      transform={(data) => {
        delete data.passwd;
        if (!changePassword) {
          delete data.password;
          delete data.repeat_password;
        }
        return data;
      }}
    >
      <SimpleForm validate={checkPassword}>
        <TextInput source="id" disabled />
        <TextInput source="username" disabled />
        <RadioButtonGroupInput
          defaultValue="access"
          source="userclass"
          choices={[
            { id: "access", name: "access" },
            { id: "resource", name: "resource" },
            { id: "dba", name: "dba" },
          ]}
        />
        <Button
          size="medium"
          label="Change Password"
          onClick={() => setChangePassword(!changePassword)}
        />
        {changePassword && (
          <>
            <PasswordInput source="password" />
            <PasswordInput source="repeat_password" />
          </>
        )}
      </SimpleForm>
    </Edit>
  );
}

const checkPassword = ({ password = "", repeat_password = "" }) => {
  if (password !== repeat_password) {
    return { repeat_password: "passwords don't match" };
  }
  return {};
};

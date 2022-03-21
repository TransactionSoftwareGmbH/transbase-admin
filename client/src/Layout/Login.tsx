import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Field, withTypes } from "react-final-form";
import { useLocation } from "react-router-dom";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/styles";
import LockIcon from "@material-ui/icons/Lock";
import { Notification, useTranslate, useLogin, useNotify } from "react-admin";
import { theme } from "./theme";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyItems: "center",
    background:
      "url(https://www.transaction.de/fileadmin/_processed_/6/0/csm_Flex_Consulting_5f33a2cdc1.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  card: {
    minWidth: 300,
    marginTop: "auto",
    marginBottom: "auto",
  },
  avatar: {
    margin: "1em",
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    padding: "0 1em 1em 1em",
  },
  input: {
    marginTop: "1em",
  },
  actions: {
    padding: "0 1em 1em 1em",
  },
}));

const renderInput = ({
  meta: { touched, error } = { touched: false, error: undefined },
  input,
  ...rest
}: {
  meta?: { touched?: boolean; error?: boolean };
  input: any;
  autoFocus?: boolean;
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...input}
    {...rest}
    fullWidth={true}
  />
);

interface FormValues {
  connection?: string;
  username?: string;
  password?: string;
}

const { Form } = withTypes<FormValues>();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();
  const location = useLocation<{ nextPathname: string } | null>();

  const handleSubmit = (auth: FormValues) => {
    setLoading(true);
    login(auth, location.state ? location.state.nextPathname : "/").catch(
      (error: Error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_in_error"
            : error.message,
          {
            type: "warning",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                  ? error.message
                  : undefined,
            },
          }
        );
      }
    );
  };

  const validate = (values: FormValues) => {
    const errors: FormValues = {};
    if (!values.username) {
      errors.username = translate("ra.validation.required");
    }
    // if (!values.password) {
    //   errors.password = translate("ra.validation.required");
    // }
    return errors;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.main}>
            <Card className={classes.card}>
              <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                  <LockIcon />
                  {/* <img src="https://www.transaction.de/fileadmin/logos/transaction_logo_2x.png" /> */}
                </Avatar>
              </div>
              <div className={classes.form}>
                <Typography variant="h6" color="primary">
                  Welcome to Transbase Admin
                </Typography>
                <div className={classes.input}>
                  <Field
                    autoFocus
                    name="connection"
                    component={renderInput}
                    label={"Database Connection"} // translate("ra.auth.connection")}
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    autoFocus
                    name="username"
                    component={renderInput}
                    label={translate("ra.auth.username")}
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    name="password"
                    component={renderInput}
                    label={translate("ra.auth.password")}
                    type="password"
                    disabled={loading}
                  />
                </div>
              </div>
              <CardActions className={classes.actions}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading}
                  fullWidth
                >
                  {loading && <CircularProgress size={25} thickness={2} />}
                  {translate("ra.auth.sign_in")}
                </Button>
              </CardActions>
            </Card>
            <Notification />
          </div>
        </form>
      )}
    />
  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
export const TransbaseLogin = (props: any) => (
  <ThemeProvider theme={createTheme(theme)}>
    <Login {...props} />
  </ThemeProvider>
);

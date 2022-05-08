import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import { useState } from "react";
import {
  Form,
  required,
  TextInput,
  useLogin,
  useNotify,
  useTranslate,
} from "react-admin";
import { useLocation } from "react-router-dom";
import { theme } from "./theme";

interface FormValues {
  connection?: string;
  username?: string;
  password?: string;
}

export const TransbaseLogin = () => {
  const [loading, setLoading] = useState(false);
  const t = useTranslate();

  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();

  const handleSubmit = (auth: FormValues) => {
    setLoading(true);
    login(
      auth,
      location.state ? (location.state as any).nextPathname : "/"
    ).catch((error: Error) => {
      const message = typeof error === "string" ? error : error?.message;
      setLoading(false);
      notify(message || "ra.auth.sign_in_error", {
        type: "warning",
        messageArgs: { _: message },
      });
    });
  };

  const fieldProps = {
    fullWidth: true,
    InputLabelProps: theme?.components?.MuiInputLabel?.defaultProps,
    disabled: loading,
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "flex-start",
          background:
            "url(https://www.transaction.de/fileadmin/_processed_/6/0/csm_Flex_Consulting_5f33a2cdc1.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Card sx={{ minWidth: 300, marginTop: "auto", marginBottom: "auto" }}>
          <Box
            sx={{
              margin: "1em",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockIcon />
            </Avatar>
          </Box>
          <Box sx={{ padding: "0 1em 1em 1em" }}>
            <Box>
              <TextInput
                autoFocus
                source="connection"
                label={t("Connection")}
                validate={required()}
                {...fieldProps}
              />
            </Box>
            <Box>
              <TextInput
                autoFocus
                source="username"
                label={t("ra.auth.username")}
                validate={required()}
                {...fieldProps}
              />
            </Box>
            <Box>
              <TextInput
                source="password"
                label={t("ra.auth.password")}
                type="password"
                {...fieldProps}
              />
            </Box>
          </Box>
          <CardActions sx={{ padding: "0 1em 1em 1em" }}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading && <CircularProgress size={25} thickness={2} />}
              {t("ra.auth.sign_in")}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Form>
  );
};

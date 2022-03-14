import React from "react";
import { AppBar } from "react-admin";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

export function TransbaseAppBar(props) {
  return (
    <AppBar {...props}>
      <Box flex="1">
        <Typography variant="h6" id="react-admin-title">
          Transbase Admin
        </Typography>
      </Box>
    </AppBar>
  );
}

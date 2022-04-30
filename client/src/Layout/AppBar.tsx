import React from "react";
import { AppBar, AppBarProps } from "react-admin";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export function TransbaseAppBar(props: AppBarProps) {
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

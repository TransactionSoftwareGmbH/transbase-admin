import { defaultTheme, RaThemeOptions } from "react-admin";

const light = {
  type: "light" as "light",
  primary: {
    main: "#336fa8",
  },
  secondary: {
    main: "#004C93",
  },
};

const dark = {
  type: "dark" as "dark",
  primary: {
    main: "#fff",
  },
  secondary: {
    main: "#003566",
  },
};

export const theme: RaThemeOptions = {
  ...defaultTheme,
  palette: window.matchMedia(`(prefers-color-scheme: dark)`).matches
    ? dark
    : light,
  components: {
    MuiInputLabel: {
      defaultProps: { shrink: true },
    },
    ...defaultTheme.components,
  },
};

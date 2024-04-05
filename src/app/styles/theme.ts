// Most custom colors are maintained in "src/app/styles/colors.ts"

import { Theme, createTheme, responsiveFontSizes } from "@mui/material/styles";

const fontFamily = "Open Sans, sans-serif";
export const primaryColor = "#0260f0";

declare module "@mui/material/styles" {
  type DefaultTheme = Theme;
  interface TypographyVariants {
    body3: React.CSSProperties;
    body4: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
  }

  interface Palette {
    brand: Palette["primary"] & { contrastBlue: string };
    brandSecondary: Palette["primary"];
    borders: {
      light: string;
      main: string;
      dark: string;
    };
    dropdowns: Palette["primary"];
    nav: Palette["primary"];
    light: Record<"secondary" | "primary", string>;
    dark: Record<string, string>;
    component: Record<string, string>;
  }
  interface PaletteOptions {
    brand: PaletteOptions["primary"] & { contrastBlue: string };
    brandSecondary: PaletteOptions["primary"];
    borders: Record<string, string>;
    nav: PaletteOptions["primary"];
    dropdowns: PaletteOptions["primary"];
    light: Record<"secondary" | "primary", string>;
    dark: Record<string, string>;
    component: Record<string, string>;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
    body4: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    brand: true;
    brandSecondary: true;
    dark: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    brand: true;
    brandSecondary: true;
    dark: true;
  }
}

// Create a theme instance.
const altTheme = createTheme({
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightLight: 300,
    fontFamily,
    h1: {
      fontSize: 38,
      fontWeight: 300,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 32,
      fontWeight: 400,
      lineHeight: 1.125,
    },
    h3: {
      fontSize: 25,
      fontWeight: 400,
      lineHeight: 1.36,
    },
    h4: {
      fontSize: 20,
      fontWeight: 400,
      lineHeight: 1.334,
    },
    h5: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.38888889,
    },
    h6: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: 16,
      lineHeight: "26px",
      fontFamily,
    },
    body2: {
      fontSize: "14px",
      lineHeight: "22px",
      fontFamily,
    },
    body3: {
      fontSize: "12px",
      lineHeight: "16px",
      fontFamily,
    },
    body4: {
      fontSize: "10px",
      lineHeight: "14px",
      fontFamily,
    },
    caption: {
      fontSize: "12px",
      lineHeight: "16px",
      fontWeight: 400,
      fontFamily,
    },
  },
});

export const theme = responsiveFontSizes(altTheme);

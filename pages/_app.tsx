import "../styles/globals.css";
import type { AppProps } from "next/app";
import { theme } from "@chakra-ui/pro-theme";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

function HighwayApp({ Component, pageProps }: AppProps) {
  const myTheme = extendTheme(
    {
      colors: { ...theme.colors, brand: theme.colors.purple },
    },
    theme
  );
  return (
    <ChakraProvider theme={myTheme}>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}

export default HighwayApp;

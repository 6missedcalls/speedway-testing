import "../styles/globals.css";
import "../public/fonts/style.css";
import type { AppProps } from "next/app";
import { theme } from "@chakra-ui/pro-theme";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { NebulaTheme } from "../styles/nebula/theme";

function HighwayApp({ Component, pageProps }: AppProps) {
  const myTheme = extendTheme(NebulaTheme, theme);
  return (
    <ChakraProvider theme={myTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default HighwayApp;

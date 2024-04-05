import "app/styles/print.css";
import "app/styles/overrideStyles.css";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { NextPageWithLayout } from "../app/util/nextHelpers";
import { hotjar } from "react-hotjar";
import { useEffect } from "react";
import Script from "next/script";
import { RecoilRoot } from "recoil";
import TagManager from "react-gtm-module";
import { NextPage } from "next";
import { Box } from "@mui/material";
import { theme } from "app/styles/theme";
import { createEmotionCache } from "app/styles/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

export interface BasePageProps {
  initializeHotjar?: boolean;
  builtAt?: string;
  locationsForSwitcher: [];
}

export const basePageProps = () => ({
  initializeHotjar: true,
  builtAt: new Date().toString(),
});

interface Props extends AppProps<BasePageProps> {
  emotionCache: ReturnType<typeof createEmotionCache>;
  Component: NextPageWithLayout<BasePageProps>;
}

const MyApp: NextPage<Props> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Box>{page}</Box>);

  useEffect(() => {
    const initializeHotjar = pageProps?.initializeHotjar ?? true;
    if (!initializeHotjar) return;
    const HOTJAR_ID = process.env.HOTJAR_ID;
    const HOTJAR_SV = process.env.HOTJAR_SV;
    if (!HOTJAR_ID || !HOTJAR_SV) {
      return;
    }
    const id = parseInt(String(process.env.HOTJAR_ID));
    const sv = parseInt(String(process.env.HOTJAR_SV));
    if (isNaN(id) || isNaN(sv)) {
      return;
    }
    hotjar.initialize(id, sv);
  }, [pageProps?.initializeHotjar]);

  const gaTrackingId = process.env.NEXT_PUBLIC_GA4_TRACKING_ID ?? "";
  const gtmId = process.env.NEXT_PUBLIC_GA_TAG_MANAGER_ID ?? "";
  useEffect(() => {
    TagManager && gtmId && TagManager.initialize({ gtmId });
  }, [gtmId]);

  return (
    <CacheProvider value={emotionCache}>
      {gaTrackingId && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
          />
          <Script strategy="lazyOnload" id="analytics_gtag">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gaTrackingId}');
            `}
          </Script>
        </>
      )}
      <Head>
        <title>MRE</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {pageProps.builtAt && (
          <meta name="builtAt" content={pageProps.builtAt} />
        )}
      </Head>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <CssBaseline />
          {getLayout(<Component {...pageProps} />)}
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;

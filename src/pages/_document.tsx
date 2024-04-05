import createEmotionServer from "@emotion/server/create-instance";
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { Children } from "react";
// eslint-disable-next-line no-restricted-imports
import { theme } from "app/styles/theme";
import { createEmotionCache } from "app/styles/createEmotionCache";

interface DocProps {
  emotionCache: ReturnType<typeof createEmotionServer>;
}
export default class MyDocument extends Document<DocProps> {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut" href="/favicons-nextjs/favicon.ico" />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-57x57.png"
            sizes="57x57"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-60x60.png"
            sizes="60x60"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-72x72.png"
            sizes="72x72"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-76x76.png"
            sizes="76x76"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-114x114.png"
            sizes="114x114"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-120x120.png"
            sizes="120x120"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-144x144.png"
            sizes="144x144"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-152x152.png"
            sizes="152x152"
          />
          <link
            rel="apple-touch-icon"
            href="/favicons-nextjs/apple-icon-180x180.png"
            sizes="180x180"
          />
          <link
            rel="icon"
            href="/favicons-nextjs/android-icon-192x192.png"
            sizes="192x192"
            type="image/png"
          />
          <link
            rel="icon"
            href="/favicons-nextjs/favicon-32x32.png"
            sizes="32x32"
            type="image/png"
          />
          <link
            rel="icon"
            href="/favicons-nextjs/favicon-96x96.png"
            sizes="96x96"
            type="image/png"
          />
          <link
            rel="icon"
            href="/favicons-nextjs/favicon-16x16.png"
            sizes="16x16"
            type="image/png"
          />
          <link rel="manifest" href="/favicons-nextjs/manifest.json" />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,700,800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  // `getInitialProps` belongs to `_document` (instead of `_app`),
  // it's compatible with static-site generation (SSG).
  static async getInitialProps(ctx: DocumentContext) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) =>
          function EnhanceApp(props) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            return <App {...props} emotionCache={cache} />;
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
    };
  }
}

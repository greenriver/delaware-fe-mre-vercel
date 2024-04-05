// See https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy
// for info about configuring CSP in Next.js.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// See https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
// for documentation on CSP and its directives.

const generateCspHeader = (): [string, string] => {
  const baseList = ["'self'"];
  const pickValues = (obj: Record<string, string>, keys: string[]): string[] =>
    Object.keys(obj)
      .filter((key) => keys.includes(key))
      .map((key) => obj[key] as string);

  const format = (list: string[] = []) => {
    const _list = list.filter((item) => item);
    return [...baseList, ..._list].map((_c) => _c).join(" ");
  };
  const unsafeInline = "'unsafe-inline'";
  const unsafeEval = "'unsafe-eval'";
  const PROD_DOMAIN = "myhealthycommunity.dhss.delaware.gov";
  const DOMAINS = [
    PROD_DOMAIN,
    ...["demo", "staging"].map((d) => `${d}-${PROD_DOMAIN}`),
  ];
  const dnrec = ["dnrec.delaware.gov", "dnrec.alpha.delaware.gov"];

  const baseMaps = ["a", "b", "c", "d"].map(
    (d) => `${d}.basemaps.cartocdn.com`
  );
  const s3 = ["production", "staging", "demo"].map(
    (d) => `dephtn-${d}.s3.amazonaws.com`
  );
  const google = {
    fonts: "fonts.googleapis.com",
    fontsStatic: "fonts.gstatic.com",
    ga: "www.google-analytics.com",
    gtm: "www.googletagmanager.com",
    ssl: "ssl.google-analytics.com",
    maps: "maps.googleapis.com",
    translate: "translate.googleapis.com",
    region1Ga: "region1.google-analytics.com",
    analytics: "analytics.google.com",
    static: "www.gstatic.com",
  };
  const hotJar = {
    script: "script.hotjar.com",
    static: "static.hotjar.com",
    metrics: "metrics.hotjar.io",
  };
  const vercel = {
    domain: "vercel.com",
    assets: "assets.vercel.com",
    live: "vercel.live",
  };

  const scriptSrcs = [
    unsafeInline,
    ...pickValues(google, ["ga", "gtm", "maps", "translate"]),
    vercel.live,
    "browser.sentry-cdn.com",
    ...Object.values(hotJar),
  ];

  const scriptSrc = format(["strict-dynamic", unsafeEval, ...scriptSrcs]);
  const scriptSrcElem = format([
    ...scriptSrcs,
    vercel.live,
    google.ssl,
    "connect.facebook.net",
  ]);
  const connectSrc = format([
    process.env.FQDN ?? "",
    ...pickValues(google, [
      "ga",
      "gtm",
      "ssl",
      "translate",
      "region1Ga",
      "analytics",
    ]),
    vercel.live,
    ...DOMAINS,
    "*.ingest.sentry.io",
    "wss://ws-us3.pusher.com",
    "*.hotjar.io",
    "in.hotjar.com",
    "wss://ws.hotjar.com",
    hotJar.metrics,
  ]);
  const fontSrc = format([
    "data:",
    google.fontsStatic,
    hotJar.script,
    vercel.assets,
  ]);
  const imgSrc = format([
    "blob:",
    "data:",
    PROD_DOMAIN,
    process.env.FQDN ?? "",
    ...baseMaps,
    ...s3,
    ...pickValues(google, ["ga", "gtm", "font", "translate", "fontsStatic"]),
    hotJar.script,
    ...Object.values(vercel),
    ...dnrec,
    "www.atsdr.cdc.gov",
  ]);
  const styleSrc = format([
    unsafeInline,
    ...pickValues(google, ["fonts", "gtm", "static"]),
  ]);
  const styleSrcElem = format([unsafeInline, google.fonts, google.gtm]);
  const frameSrc = format([vercel.live, "www.youtube.com"]);
  const mediaSrc = format([...s3]);
  const manifestSrc = format();
  const defaultSrc = format(DOMAINS);
  const formAction = format(["export.highcharts.com"]);

  const cspHeader = `
    base-uri 'self';
    block-all-mixed-content;
    connect-src ${connectSrc};
    default-src ${defaultSrc};
    font-src ${fontSrc};
    form-action ${formAction};
    frame-ancestors 'none';
    frame-src ${frameSrc};
    img-src ${imgSrc};
    manifest-src ${manifestSrc};
    media-src ${mediaSrc};
    object-src 'none';
    report-uri ${process.env.NEXT_PUBLIC_SENTRY_REPORT_URI ?? ""};
    script-src ${scriptSrc};
    script-src-elem ${scriptSrcElem};
    style-src ${styleSrc};
    style-src-elem ${styleSrcElem};
  `;

  return [
    "Content-Security-Policy-Report-Only",
    cspHeader.replace(/\s{2,}/g, " ").trim(),
  ];
};

export default generateCspHeader;

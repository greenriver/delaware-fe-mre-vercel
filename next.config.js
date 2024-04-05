const checkEnv = (env) => process.env.ENVIRONMENT === env;
const envIsDev = (() => checkEnv("dev"))();

// TODO improve security headers
const headers = [
  {
    key: "referrer-policy",
    value: "no-referrer-when-downgrade"
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  }
];
if (!envIsDev) {
  headers.push({
    key: "content-security-policy",
    value: "upgrade-insecure-requests"
  });
}

const moduleExports = {
  staticPageGenerationTimeout: 200,
  output: "standalone",
  env: {
    HOTJAR_ID: process.env.HOTJAR_ID,
    HOTJAR_SV: process.env.HOTJAR_SV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    DATA_STORIES__FEATURE_SIDEBAR: process.env.DATA_STORIES__FEATURE_SIDEBAR,
    SHOW_STAGING_BANNER: process.env.SHOW_STAGING_BANNER,
    ENVIRONMENT: process.env.ENVIRONMENT,
    SHOW_CPR_ON_SIDE_NAV: process.env.SHOW_CPR_ON_SIDE_NAV,
    GRAPHQL_API_BASIC_AUTH: process.env.GRAPHQL_API_BASIC_AUTH,
    GRAPHQL_API: process.env.GRAPHQL_API,
    GRAPHQL_API_AUTH_KEY: process.env.GRAPHQL_API_AUTH_KEY,
    NEXT_PUBLIC_PROD_DOMAIN: process.env.NEXT_PUBLIC_PROD_DOMAIN || "",
    NEXT_PUBLIC_ENV: process.env.ENVIRONMENT,
    DEFAULT_REVALIDATE: process.env.DEFAULT_REVALIDATE,
    NEXT_PUBLIC_GA_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GA_TAG_MANAGER_ID,
    NEXT_PUBLIC_GA4_TRACKING_ID: process.env.NEXT_PUBLIC_GA4_TRACKING_ID
  },
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false
  },
  devIndicators: {
    autoPrerender: false
  },
  exclude: ["**/__test__**", "**/*.stories.tsx"],
  experimental: {
    largePageDataBytes: 6000000
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhss.delaware.gov",
        port: "",
        pathname: "/dhss/img/**"
      }
    ]
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: headers
      }
    ];
  }
};

if (process.env.ANALYZE === "true") {
  // eslint-disable-next-line no-console
  console.log(`\n\n\n\n---\nANALYZING\n---\n\n\n\n`);

  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  module.exports = withBundleAnalyzer(moduleExports, {});
} else {
  module.exports = moduleExports;
}

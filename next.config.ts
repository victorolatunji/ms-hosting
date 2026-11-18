import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Renamed and retired listing URLs.
  async redirects() {
    return [
      { source: "/stays/fully-private-hot-tub-suite", destination: "/stays/hot-tub-oasis", permanent: true },
      { source: "/stays/cozy-toes-city-glows", destination: "/stays/fire-pit-guest-suite", permanent: true },
      // Homes M&S no longer host (removed Nov 2026).
      { source: "/stays/4br-retreat-hot-tub", destination: "/cities/oshawa", permanent: true },
      { source: "/stays/spacious-home-movie-lounge", destination: "/cities/ajax", permanent: true },
      { source: "/stays/luxury-recreation-retreat", destination: "/#stays", permanent: true },
      { source: "/stays/modern-townhouse-square-one", destination: "/#stays", permanent: true },
      { source: "/cities/uxbridge", destination: "/#cities", permanent: true },
      { source: "/cities/mississauga", destination: "/#cities", permanent: true },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "ms-hosting-solutions",

  project: "ms-hosting",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  }
});

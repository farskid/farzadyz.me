import "../styles/globals.scss";
import "../styles/nprogress.css";
import "../styles/highlight.css";
import "../styles/blog-post.scss";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../src/theme";
import NProgress from "nprogress";
import Router from "next/router";
import NextHead from "next/head";
import { MetadataProvider } from "../src/MetadataContext";
import { makeMetadata } from "../content/metadata";
import splitbee from "@splitbee/web";
import { useEffect } from "react";

/* NProgress */
NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});
Router.events.on("routeChangeError", () => {
  NProgress.done();
});
/* /NProgress */

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.log("Analytics initialized");
      splitbee.init({
        disableCookie: true,
        scriptUrl: "https://cdn.splitbee.io/sb.js",
        apiUrl: "https://hive.splitbee.io",
        token: process.env.NEXT_PUBLIC_ANALYTICS_TOKEN,
      });
    } else {
      console.log("Non-prod mode, skipping analytics");
    }
  }, []);
  return (
    <MetadataProvider
      value={{
        default: makeMetadata(),
        makeMetadata,
      }}
    >
      <ChakraProvider resetCSS theme={theme}>
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Subscribe to farzadyz.me/blog"
            href="/feeds/rss.xml"
          />
          <link
            rel="alternate"
            type="application/atom+xml"
            title="Subscribe to farzadyz.me/blog"
            href="/feeds/atom.xml"
          />
          <link
            rel="alternate"
            type="application/feed+json"
            title="Subscribe to farzadyz.me/blog"
            href="/feeds/feed.json"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="theme-color" content="#ffffff" />
          {/* <script
            defer
            data-domain="stately.ai"
            src="https://plausible.io/js/plausible.js"
          ></script> */}
        </NextHead>
        <Component {...pageProps} />
      </ChakraProvider>
    </MetadataProvider>
  );
}
export default MyApp;

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

/* NProgress */
NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", (url) => {
  NProgress.done();
  // Client-side navigations — initial load is counted by count.js onload
  if (typeof window !== "undefined" && window.goatcounter?.count) {
    window.goatcounter.count({
      path: url,
    });
  }
});
Router.events.on("routeChangeError", () => {
  NProgress.done();
});
/* /NProgress */

const goatcounterCode =
  process.env.NEXT_PUBLIC_GOATCOUNTER_CODE || "farzadyzme";

function MyApp({ Component, pageProps }: AppProps) {
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
          {process.env.NODE_ENV === "production" && goatcounterCode ? (
            <script
              data-goatcounter={`https://${goatcounterCode}.goatcounter.com/count`}
              async
              src="https://gc.zgo.at/count.js"
            />
          ) : null}
        </NextHead>
        <Component {...pageProps} />
      </ChakraProvider>
    </MetadataProvider>
  );
}
export default MyApp;

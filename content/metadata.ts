// import { value MetadataOverrides } from "../src/types";

import { MetadataOverrides } from "../src/types";

export const DEFAULT_TITLE = "Farzad Yousefzadeh";
export const DEFAULT_DESCRIPTION =
  "Personal website owned by Farzad Yousefzadeh";
export const DEFAULT_URL = "https://farzadyz.me";

const OTHER_INFO = {
  fullname: "Farzad Yousefzadeh",
  social: {
    twitter: {
      handle: "@farzad_yz",
      link: "https://twitter.com/@farzad_yz",
    },
    github: {
      username: "farskid",
      link: "https://github.com/farskid",
    },
    stackoverflow: {
      link: "https://stackoverflow.com/users/2784512/farzad-yz",
    },
    medium: {
      link: "https://medium.com/@Farzad_YZ",
    },
    linkedin: {
      link: "https://www.linkedin.com/in/farzadyz",
    },
  },
};

export const makeMetadata = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  url = DEFAULT_URL,
  originalURL,
  article,
}: MetadataOverrides | undefined = {}) => ({
  ...OTHER_INFO,
  title,
  description,
  canonical: originalURL,
  openGraph: {
    url,
    title,
    description,
    type: article ? "article" : "website",
    locale: "en_US",
    site_name: DEFAULT_TITLE,
    // TODO: use a cloud function to generate the image dynamically based on the page data
    // images: [
    //   {
    //     url: "https://stately.ai/blog/og-image.png", // needs to be absolute URL
    //     width: 0,
    //     height: 0,
    //     alt: title,
    //     type: "image/png", // change based on actual OG image type
    //   },
    // ],
    article,
  },
  twitter: {
    handle: "@farzad_yz",
    site: "@farzad_yz",
    cardType: "summary_large_image",
    creator: "Farzad Yousefzadeh",
  },
});

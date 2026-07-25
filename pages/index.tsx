import { NextPage } from "next";
import { Layout } from "../src/Layout";
import { getAllPosts } from "../src/posts";
import { Seo } from "../src/Seo";
import { Link, Box, VStack } from "@chakra-ui/react";
import { useMetadata } from "../src/MetadataContext";
import NextLink from "next/link";

const HomePage: NextPage = () => {
  const { default: metadata } = useMetadata();
  return (
    <>
      <Seo />
      <Layout>
        <VStack gridGap="8">
          <Box gridGap="5" display="flex" flexDirection="column">
            <p>
              I'm a Principal Software Engineer at{" "}
              <Link
                textDecoration="underline"
                isExternal
                rel="nofollow noopener noreferrer"
                href="https://lottiefiles.com"
              >
                <strong>LottieFiles</strong>
              </Link>
              , where I work on the{" "}
              <Link
                textDecoration="underline"
                isExternal
                rel="nofollow noopener noreferrer"
                href="https://creator.lottiefiles.com/"
              >
                Creator
              </Link>{" "}
              platform.
            </p>
            <p>
              I specialize in <strong>developer tooling</strong>, and these
              days I build <strong>AI-capable software</strong> and custom
              agent harnesses. My work spans workflow engines, web rendering
              engines, CLIs, SDKs, compilers and AST tooling, custom protocols
              and serialization, and context and memory management for AI
              agents.
            </p>
            <p>
              Previously, I was a core contributor to{" "}
              <Link
                textDecoration="underline"
                isExternal
                rel="nofollow noopener noreferrer"
                href="https://github.com/statelyai/xstate"
              >
                XState
              </Link>{" "}
              and Stately, led game services at Epic Games and worked on a wide
              range of software throughout my career.
            </p>
            <p>
              I{" "}
              <NextLink href="/appearances#talks" passHref>
                <Link textDecoration="underline">speak at conferences</Link>
              </NextLink>{" "}
              about state machines, developer tooling and UI architecture.
            </p>
            <p className="spacing-h spacing-small">
              You can find me on{" "}
              <Link
                isExternal
                rel="nofollow noopener noreferrer"
                className="social-link "
                href={metadata.social.twitter.link}
                textDecoration="underline"
              >
                Twitter
              </Link>
              ,{" "}
              <Link
                isExternal
                rel="nofollow noopener noreferrer"
                className="social-link "
                href={metadata.social.github.link}
                textDecoration="underline"
              >
                GitHub
              </Link>
{" "}
              and{" "}
              <Link
                isExternal
                rel="nofollow noopener noreferrer"
                className="social-link "
                href={metadata.social.linkedin.link}
                textDecoration="underline"
              >
                LinkedIn
              </Link>
              .
            </p>
          </Box>
        </VStack>
      </Layout>
    </>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      posts: await getAllPosts(),
    },
  };
};

export default HomePage;

import { NextPage } from "next";
import { Layout } from "../src/Layout";
import { getAllPosts } from "../src/posts";
import { Seo } from "../src/Seo";
import { Link, Box, VStack, Heading, Text } from "@chakra-ui/react";
import { useMetadata } from "../src/MetadataContext";
import NextLink from "next/link";

const selectedWork: Array<{
  title: string;
  href: string;
  description: string;
}> = [
  {
    title: "LottieFiles Creator",
    href: "https://creator.lottiefiles.com/",
    description:
      "A browser-based animation editor. I own the TypeScript editor and canvas UI that sit on top of a Rust and WASM rendering engine.",
  },
  {
    title: "Stately Visualizer and Inspect",
    href: "https://github.com/statelyai/xstate-viz",
    description:
      "Visual tooling for XState: the machine visualizer, the inspect protocol for observing live applications, and editor work that keeps diagrams and TypeScript in sync.",
  },
  {
    title: "zast",
    href: "https://github.com/farskid/zast",
    description:
      "Schema-based AST matching for TypeScript, in the spirit of Zod. Describe the shape of the code you are looking for instead of walking the tree by hand.",
  },
  {
    title: "Canopy",
    href: "https://github.com/farskid/canopy",
    description:
      "A local-first AI workspace with branching chat, a document editor and a companion agent. My playground for agent harnesses, context and memory management.",
  },
];

const HomePage: NextPage = () => {
  const { default: metadata } = useMetadata();
  return (
    <>
      <Seo />
      <Layout>
        <VStack gridGap="8" alignItems="stretch">
          <Box gridGap="5" display="flex" flexDirection="column">
            <p>
              I&apos;m a Principal Software Engineer at{" "}
              <Link
                textDecoration="underline"
                isExternal
                rel="nofollow noopener noreferrer"
                href="https://lottiefiles.com"
              >
                <strong>LottieFiles</strong>
              </Link>
              , where I own{" "}
              <Link
                textDecoration="underline"
                isExternal
                rel="nofollow noopener noreferrer"
                href="https://creator.lottiefiles.com/"
              >
                Creator
              </Link>
              , a browser-based animation editor. I build the TypeScript editor
              and canvas experience on top of a Rust and WASM rendering engine,
              and a large part of my job is keeping a very heavy canvas feeling
              fast.
            </p>
            <p>
              My specialty is <strong>visual editors</strong>,{" "}
              <strong>canvas and product UIs</strong>, and{" "}
              <strong>component systems</strong> that other engineers build on.
              I think about interfaces in the wide sense: the things people
              click in the browser, but also the APIs, protocols and engine
              boundaries behind them.
            </p>
            <p>
              I also go deep on tooling and AI agents. I build custom agent
              harnesses and care a lot about context and memory management, MCP
              integrations, compilers and AST tooling, CLIs and SDKs.
            </p>
            <p>
              Before LottieFiles I worked at Stately, where I built the machine
              visualizer, the inspect protocol and editor features that keep
              statechart diagrams and TypeScript in sync, alongside core work
              on{" "}
              <Link
                textDecoration="underline"
                isExternal
                rel="nofollow noopener noreferrer"
                href="https://github.com/statelyai/xstate"
              >
                XState
              </Link>
              . Before that I was at Epic Games, where I maintained the Epic UI
              design system and helped design Epic&apos;s TypeScript SDK, and
              at Futurice, where I led the rebuild of IS and HS, two of the
              biggest news sites in Finland.
            </p>
            <p>
              I{" "}
              <NextLink href="/appearances#talks" passHref>
                <Link textDecoration="underline">speak at conferences</Link>
              </NextLink>{" "}
              about visual editors, state machines and UI architecture, and my{" "}
              <NextLink href="/appearances" passHref>
                <Link textDecoration="underline">appearances</Link>
              </NextLink>{" "}
              include live streams building editor features at Stately.
            </p>
            <p>I&apos;m based in Helsinki and comfortable working US hours.</p>
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
              </Link>{" "}
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
          <VStack alignItems="stretch" gridGap="4">
            <Heading fontSize="2xl">
              <strong>Selected work</strong>
            </Heading>
            {selectedWork.map((work) => (
              <Box
                key={work.title}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                padding="4"
              >
                <VStack alignItems="stretch">
                  <Heading as="h3" fontSize="md">
                    <Link
                      isExternal
                      rel="nofollow noopener noreferrer"
                      href={work.href}
                      textDecoration="underline"
                    >
                      <strong>{work.title}</strong>
                    </Link>
                  </Heading>
                  <Text fontSize="md">{work.description}</Text>
                </VStack>
              </Box>
            ))}
          </VStack>
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

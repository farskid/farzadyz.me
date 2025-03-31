import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Post } from "../../src/types";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPosts } from "../../src/posts";
import { Layout } from "../../src/Layout";
import {
  Box,
  Heading,
  Link as ChakraLink,
  HStack,
  Text,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { MDXComponents } from "../../src/MDXComponents";
import { Seo } from "../../src/Seo";
import { DEFAULT_URL } from "../../content/metadata";
import { formatDate } from "../../src/utils";
import { serializePost } from "../../src/serializePost";
import NextLink from "next/link";
import { useMemo } from "react";
import { useMetadata } from "../../src/MetadataContext";
import { TwitterIcon } from "../../src/Icons";

const PostPage: React.FC<{
  post: Post;
  mdx: MDXRemoteSerializeResult;
}> = ({ post, mdx }) => {
  const { makeMetadata } = useMetadata();
  const metadata = makeMetadata({
    title: post.title,
    description: post.description,
    originalURL: post.originalURL,
    url: `https://farzadyz.me/blog/${post.slug}`,
    article: {
      publishedTime: post.publishedAt,
      authors: ["Farzad Yousefzadeh"],
      tags: post.tags,
      // modifiedTime: post.modifiedAt // TODO
    },
  });
  const shareURL = useMemo(() => {
    const hashtags = post.tags.join(",");
    const u = new URL("https://twitter.com/share");
    u.searchParams.append(
      "text",
      `Check out: ${post.title} by ${metadata.social.twitter.handle}`
    );
    u.searchParams.append("url", `https://farzadyz.me/blog/${post.slug}`);
    u.searchParams.append("hashtags", hashtags);
    return u.toString();
  }, [post, metadata.social.twitter.handle]);
  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        url={`${[DEFAULT_URL, post.slug].join("/")}`}
        originalURL={post.originalURL}
        article={{
          authors: ["Farzad Yousefzadeh"],
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          tags: post.tags,
        }}
      />
      <Layout>
        <Box
          as="article"
          className="blog-post"
          textAlign="left"
          padding={{ base: "0", md: "4" }}
          maxW="3xl"
          // contentEditable={
          //   typeof window === "undefined" || window.self !== window.top
          //     ? false
          //     : process.env.NODE_ENV === "development" || post.draft
          // }
        >
          <Heading size="xl" as="h1" fontWeight="medium">
            {post.draft && <Badge colorScheme="yellow">Draft</Badge>}{" "}
            <strong>{post.title}</strong>
          </Heading>
          <Text as="small">{formatDate(post.publishedAt)}</Text>

          <Divider marginTop="3" />
          <HStack
            justifyContent="space-between"
            alignItems="center"
            paddingTop="2"
            paddingBottom="4"
          >
            <NextLink href="/blog" passHref={false}>
              <ChakraLink textDecoration="underline" fontSize="md">
                Check out all posts
              </ChakraLink>
            </NextLink>
            <Box display="flex" gridGap="5">
              <ChakraLink
                isExternal
                href={`https://github.com/farskid/farzadyz.me/edit/main/content/posts/${post.fileName}`}
                fontSize="md"
                textDecoration="underline"
              >
                Edit on GitHub
              </ChakraLink>
              <ChakraLink
                isExternal
                href={shareURL}
                fontSize="md"
                textDecoration="underline"
              >
                <TwitterIcon />
              </ChakraLink>
            </Box>
          </HStack>
          <Divider />

          <Box
            paddingTop="2"
            marginTop="2"
            className="blog-post-content"
            borderStyle="solid"
            borderColor="gray.700"
          >
            <MDXRemote {...mdx} components={MDXComponents} lazy={false} />
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllPosts()).map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const posts = await getAllPosts({ withContent: true });
  const post = posts.find((post) => post.slug === ctx.params.slug);

  return {
    props: {
      post,
      mdx: await serializePost(post),
    },
  };
};

export default PostPage;

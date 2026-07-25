import { Box, Link as ChakraLink, List, Text } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import { useMetadata } from "./MetadataContext";

const navLinks: Readonly<
  Array<{
    title: string;
    href: string;
    isExternal?: boolean;
  }>
> = [
  { title: "About", href: "/" },
  // { title: "CV", href: "/cv" },
  { title: "Appearances", href: "/appearances" },
  { title: "Blog", href: "/blog" },
  {
    title: "Mentorship",
    href: "https://mentorcruise.com/mentor/FarzadYousefZadeh/",
    isExternal: true,
  },
];

export function isCurrentRoute(href: string, pathname: string): boolean {
  return href === "/" ? href === pathname : pathname.includes(href);
}

export const PageHeader: React.FC = () => {
  const { default: metadata } = useMetadata();
  const router = useRouter();

  return (
    <Box as="header" display="flex" flexDirection="column" alignItems="center">
      <Box
        display="block"
        as="figure"
        width="100px"
        height="100px"
        borderRadius="50%"
        backgroundImage={`url(/farzad-yousefzadeh.webp)`}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
      ></Box>
      <Text fontSize="2em" as="strong">
        {metadata.fullname}
      </Text>
      <List
        listStyleType="none"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {navLinks.map((link) => (
          <Box as="li" key={link.title}>
            {link.isExternal ? (
              <ChakraLink
                href={link.href}
                display="block"
                padding="2"
                isExternal={link.isExternal}
                rel="nofollow noopener noreferrer"
              >
                {link.title}
              </ChakraLink>
            ) : (
              <NextLink href={link.href} passHref>
                <ChakraLink
                  display="block"
                  padding="2"
                  isExternal={link.isExternal}
                >
                  {isCurrentRoute(link.href, router.pathname) ? (
                    <strong>{link.title}</strong>
                  ) : (
                    link.title
                  )}
                </ChakraLink>
              </NextLink>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

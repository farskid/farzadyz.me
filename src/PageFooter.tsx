import { Box, Link as ChakraLink, Text } from "@chakra-ui/react";

export const PageFooter: React.FC = () => (
  <Box as="footer" textAlign="center">
    <Text>
      The materials of this website are licensed under{" "}
      <ChakraLink
        textDecoration="underline"
        isExternal
        rel="nofollow noopener noreferrer"
        href="https://creativecommons.org/licenses/by-nc/2.0/"
      >
        <em>The Creative Commons</em>
      </ChakraLink>
    </Text>
  </Box>
);

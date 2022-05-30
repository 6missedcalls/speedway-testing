import type { NextPage } from "next";
import { NextSeo } from "next-seo";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Stack,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { Sidebar } from "../../components/Sidebar";
import { Button } from "@chakra-ui/react";
import { FiDownloadCloud } from "react-icons/fi";
import { Card } from "../../components/Card";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Using More of Config"
        description="This example uses more of the available config options."
        canonical="https://www.canonical.ie/"
        openGraph={{
          url: "https://www.url.ie/a",
          title: "Open Graph Title",
          description: "Open Graph Description",
          images: [
            {
              url: "https://www.example.ie/og-image-01.jpg",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
            {
              url: "https://www.example.ie/og-image-02.jpg",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
            { url: "https://www.example.ie/og-image-03.jpg" },
            { url: "https://www.example.ie/og-image-04.jpg" },
          ],
          site_name: "SiteName",
        }}
        twitter={{
          handle: "@sonr-io",
          site: "@site",
          cardType: "summary_large_image",
          
        }}
      />
      <Box height="100vh" overflow="hidden" position="relative">
        <Flex h="full" id="app-container">
          <Sidebar />
          <Box bg={mode("white", "gray.800")} flex="1" p="6">
            <Stack spacing="1">
              <Heading
                size={useBreakpointValue({ base: "xs", lg: "sm" })}
                fontWeight="medium"
              >
                Dashboard
              </Heading>
              <Text color="muted">All important metrics at a glance</Text>
            </Stack>
            <Stack
              direction="row"
              spacing="3"
              mb="24px
          "
            >
              <Button
                variant="secondary"
                leftIcon={<FiDownloadCloud fontSize="1.25rem" />}
              >
                Download
              </Button>
              <Button variant="primary">Create</Button>
            </Stack>
            <Box
              w="full"
              h="full"
              rounded="lg"
              border="3px dashed currentColor"
              color={mode("gray.200", "gray.700")}
              padding="4"
              mb="24px"
            >
              <Stack spacing={{ base: "8", lg: "6" }}>
                <Stack
                  spacing="4"
                  direction={{ base: "column", lg: "row" }}
                  justify="space-between"
                ></Stack>
                <Stack spacing={{ base: "5", lg: "6" }}>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                    <Card />
                    <Card />
                    <Card />
                  </SimpleGrid>
                </Stack>
                <Card minH="xs" />
              </Stack>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Home;

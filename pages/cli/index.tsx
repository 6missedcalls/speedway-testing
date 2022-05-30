import type { NextPage } from "next";
import {
  Box,
  Heading,
  Stack,
  Text,
  Button,
  Circle,
  Img,
  LightMode,
  SimpleGrid,
  useDisclosure,
  useColorMode as mode,
  VisuallyHidden,
} from "@chakra-ui/react";
import * as React from "react";

import { FaPlay } from "react-icons/fa";
import * as Logos from "../../components/Brands";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  Terminal,
  commandWord,
  useEventQueue,
  textLine,
  textWord,
} from "crt-terminal";

const bannerText = `
Hello world!

And not only world
`;

const Home: NextPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });
  const eventQueue = useEventQueue();
  const { print } = eventQueue.handlers;
  return (
    <main>
      <Navbar style={"light"} />
      <Box>
        <Box as="section" bg="gray.800" color="white" py="7.5rem">
          <Box
            maxW={{ base: "xl", md: "5xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
          >
            <Box textAlign="center">
              <Heading
                as="h1"
                size="3xl"
                fontWeight="extrabold"
                maxW="48rem"
                mx="auto"
                lineHeight="1.2"
                letterSpacing="tight"
              >
                Design collaboration without the chaos
              </Heading>
              <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore
              </Text>
            </Box>

            <Stack
              justify="center"
              direction={{ base: "column", md: "row" }}
              mt="10"
              mb="20"
              spacing="4"
            >
              <LightMode>
                <Button
                  as="a"
                  href="#"
                  size="lg"
                  colorScheme="blue"
                  px="8"
                  fontWeight="bold"
                  fontSize="md"
                >
                  Get started free
                </Button>
                <Button
                  as="a"
                  href="#"
                  size="lg"
                  colorScheme="whiteAlpha"
                  px="8"
                  fontWeight="bold"
                  fontSize="md"
                >
                  Request demo
                </Button>
              </LightMode>
            </Stack>

            <Box
              className="group"
              cursor="pointer"
              position="relative"
              rounded="lg"
              overflow="hidden"
            >
              <div style={{ width: "1000px", height: "600px" }}>
                <Terminal
                  queue={eventQueue}
                  banner={[
                    textLine({ words: [textWord({ characters: bannerText })] }),
                  ]}
                  onCommand={(command) =>
                    print([
                      textLine({
                        words: [
                          textWord({ characters: "You entered command: " }),
                          commandWord({ characters: command, prompt: ">" }),
                        ],
                      }),
                    ])
                  }
                />
              </div>
            </Box>
          </Box>
        </Box>

        <Box as="section" py="24">
          <Box
            maxW={{ base: "xl", md: "7xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
          >
            <Text
              fontWeight="bold"
              fontSize="sm"
              textAlign="center"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Trusted by over 6,000 blues
            </Text>
            <SimpleGrid
              mt="8"
              columns={{ base: 1, md: 2, lg: 6 }}
              color="gray.500"
              alignItems="center"
              justifyItems="center"
              spacing={{ base: "12", lg: "24" }}
              fontSize="2xl"
            >
              <Logos.ChatMonkey />
              <Logos.Wakanda />
              <Logos.Lighthouse />
              <Logos.Plumtic />
              <Logos.WorkScout />
              <Logos.Finnik />
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </main>
  );
};

export default Home;

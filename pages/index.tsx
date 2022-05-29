import type { NextPage } from "next";
import {
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Button,
  Circle,
  Img,
  LightMode,
  SimpleGrid,
  Container,
  Icon,
  Square,
  ButtonGroup,
  IconButton,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  Flex,
} from "@chakra-ui/react";
import * as React from "react";

import { FaGithub, FaLinkedin, FaPlay, FaTwitter } from "react-icons/fa";
import * as Logos from "../components/Brands";
import { Navbar } from "../components/Navbar";
import { FiArrowRight } from "react-icons/fi";
import { features } from "../models/featuresData";
import { Logo } from "../components/Logo";

const Home: NextPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false });
  return (
    <main>
      <Navbar />
      <Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
          <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
          <ModalContent>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/bex88Ku9Crk?controls=0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </ModalContent>
        </Modal>
        <Box
          as="section"
          bg={useColorModeValue("gray.50", "gray.800")}
          pt="24"
          pb="12"
          overflow="hidden"
        >
          <Box
            maxW={{ base: "xl", md: "7xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
          >
            <Flex
              align="flex-start"
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              mb="20"
            >
              <Box flex="1" maxW={{ lg: "xl" }} pt="6">
                <Heading as="h1" size="3xl" mt="8" fontWeight="extrabold">
                  Highway SDK by Sonr
                </Heading>
                <Text
                  color={useColorModeValue("gray.600", "gray.400")}
                  mt="5"
                  fontSize="xl"
                >
                  The most robust Decentralized Web SDK in the world. Take your
                  Applications to production yesterday.
                </Text>
                <ButtonGroup spacing="4" mt="6">
                  <Button
                    mt="8"
                    minW="14rem"
                    colorScheme="blue"
                    size="lg"
                    height="14"
                    px="8"
                    fontSize="md"
                    fontWeight="bold"
                  >
                    View Documentation
                  </Button>
                  <Button
                    mt="8"
                    minW="14rem"
                    size="lg"
                    height="14"
                    px="8"
                    fontSize="md"
                    fontWeight="bold"
                  >
                    Get Early Access
                  </Button>
                </ButtonGroup>
              </Box>
              <Box boxSize={{ base: "20", lg: "8" }} />
              <Img
                pos="relative"
                marginEnd="-16rem"
                w="50rem"
                src="https://res.cloudinary.com/chakra-ui-pro/image/upload/v1621082943/pro-website/screenshot-dark_w6jpks.png"
                alt="Screenshot for Form builder"
              />
            </Flex>
            <Box>
              <Text
                color={useColorModeValue("gray.600", "gray.400")}
                fontWeight="medium"
              >
                Proudly trusted by 5,000+ companies and individuals
              </Text>
              <SimpleGrid
                mt="8"
                columns={{ base: 2, md: 3, lg: 6 }}
                color="gray.500"
                alignItems="center"
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
        <Box as="section" bg="bg-accent" color="on-accent">
          <Container py={{ base: "16", md: "24" }}>
            <Stack spacing={{ base: "8", md: "10" }}>
              <Stack spacing={{ base: "4", md: "5" }} align="center">
                <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
                  Ready to Own?
                </Heading>
                <Text
                  color="on-accent-muteed"
                  maxW="2xl"
                  textAlign="center"
                  fontSize="xl"
                >
                  With this beautiful and responsive React components you will
                  realize your next project in no time.
                </Text>
              </Stack>
              <Stack
                spacing="3"
                direction={{ base: "column", sm: "row" }}
                justify="center"
              >
                <Button
                  variant="secondary-on-accent"
                  size="lg"
                  onClick={() => {
                    window.scrollBy({
                      top: window.innerHeight,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  Learn more
                </Button>
                <Button variant="primary-on-accent" size="lg" onClick={onOpen}>
                  Watch Video
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>
        <Box as="section" bg="bg-surface" id="features">
          <Container py={{ base: "16", md: "24" }}>
            <Stack spacing={{ base: "12", md: "16" }}>
              <Stack spacing={{ base: "4", md: "5" }} maxW="3xl">
                <Stack spacing="3">
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="semibold"
                    color="accent"
                  >
                    Features
                  </Text>
                  <Heading size={useBreakpointValue({ base: "sm", md: "md" })}>
                    What can you expect?
                  </Heading>
                </Stack>
                <Text color="muted" fontSize={{ base: "lg", md: "xl" }}>
                  A robust CLI console to allow developers to easily configure
                  Apps, with all the Sonr Modules available out of the box.
                </Text>
              </Stack>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                columnGap={8}
                rowGap={{ base: 10, md: 16 }}
              >
                {features.map((feature) => (
                  <Stack key={feature.name} spacing={{ base: "4", md: "5" }}>
                    <Square
                      size={{ base: "10", md: "12" }}
                      bg="accent"
                      color="inverted"
                      borderRadius="lg"
                    >
                      <Icon
                        as={feature.icon}
                        boxSize={{ base: "5", md: "6" }}
                      />
                    </Square>
                    <Stack spacing={{ base: "1", md: "2" }} flex="1">
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="medium"
                      >
                        {feature.name}
                      </Text>
                      <Text color="muted">{feature.description}</Text>
                    </Stack>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      rightIcon={<FiArrowRight fontSize="1.25rem" />}
                      alignSelf="start"
                    >
                      Read more
                    </Button>
                  </Stack>
                ))}
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>

        <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }}>
          <Stack spacing={{ base: "4", md: "5" }}>
            <Stack justify="space-between" direction="row" align="center">
              <Logo type="Default" size="md" mb="8px" />
              <ButtonGroup variant="ghost">
                <IconButton
                  as="a"
                  href="#"
                  aria-label="LinkedIn"
                  icon={<FaLinkedin fontSize="1.25rem" />}
                />
                <IconButton
                  as="a"
                  href="#"
                  aria-label="GitHub"
                  icon={<FaGithub fontSize="1.25rem" />}
                />
                <IconButton
                  as="a"
                  href="#"
                  aria-label="Twitter"
                  icon={<FaTwitter fontSize="1.25rem" />}
                />
              </ButtonGroup>
            </Stack>
            <Text fontSize="sm" color="subtle">
              &copy; {new Date().getFullYear()} Sonr, Inc. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </main>
  );
};

export default Home;

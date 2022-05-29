import type { NextPage } from "next";
import {
  Box,
  Flex,
  HStack,
  DarkMode,
  Heading,
  AvatarGroup,
  Avatar,
  Center,
  Stack,
  Text,
  useColorModeValue,
  useBreakpointValue,
  Button,
  Circle,
  Img,
  LightMode,
  SimpleGrid,
  VisuallyHidden,
  Container,
  Icon,
  Square,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import * as React from "react";

import { FaGithub, FaLinkedin, FaPlay, FaTwitter } from "react-icons/fa";
import * as Logos from "../components/Brands";
import { Navbar } from "../components/Navbar";
import { FiArrowRight } from "react-icons/fi";
import { features } from "./data";
import { Logo } from "../components/Logo";

const Home: NextPage = () => {
  return (
    <Box>
      <Navbar />
      <Box as="section" bg="gray.800" color="white" py="8.5rem">
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
              Launch Decentralized Apps in Seconds
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
            <Img
              alt="Screenshot of Envelope App"
              src="https://res.cloudinary.com/chakra-ui-pro/image/upload/v1621085270/pro-website/app-screenshot-light_kit2sp.png"
            />
            <Circle
              size="20"
              as="button"
              bg="white"
              shadow="lg"
              color="blue.600"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate3d(-50%, -50%, 0)"
              fontSize="xl"
              transition="all 0.2s"
              _groupHover={{
                transform: "translate3d(-50%, -50%, 0) scale(1.05)",
              }}
            >
              <VisuallyHidden>Play demo video</VisuallyHidden>
              <FaPlay />
            </Circle>
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
            color={useColorModeValue("gray.600", "gray.400")}
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
      <Box as="section" bg="bg-surface">
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
                A bundle of 210+ ready-to-use, responsive and accessible
                components with clever structured sourcode files.
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
                    <Icon as={feature.icon} boxSize={{ base: "5", md: "6" }} />
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
            <Logo />
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
            &copy; {new Date().getFullYear()} Chakra UI Pro, Inc. All rights
            reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;

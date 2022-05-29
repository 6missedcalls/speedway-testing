import {
  ButtonGroup,
  Container,
  IconButton,
  Text,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
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
  );
};

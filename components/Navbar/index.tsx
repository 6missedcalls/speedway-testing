import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { FiMenu } from "react-icons/fi";
import { PopoverIcon } from "./PopoverIcon";
import { Logo } from "./Logo";
import { ResourcesSubmenu } from "./DocumentationSubmenu";
import { ResourcesPopover } from "./ResourcesPopover";

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { onToggle, isOpen } = useDisclosure({ defaultIsOpen: false });
  return (
    <Box as="nav" bg="bg-surface">
      <Container py={{ base: "4", lg: "5" }}>
        <HStack spacing="10" justify="space-between">
          <Logo />
          {isDesktop ? (
            <Flex ml="24px" justify="space-between" flex="1">
              <ButtonGroup variant="link" spacing="8">
                <Button>CLI</Button>
                <Button
                  variant="link"
                  rightIcon={<PopoverIcon isOpen={isOpen} />}
                  onClick={onToggle}
                >
                  Documentation
                </Button>
                <ResourcesPopover />
              </ButtonGroup>
              <HStack spacing="3">
                <Button
                  variant="primary"
                  onClick={() => {
                    window.location.href = "/auth";
                  }}
                >
                  Get Started
                </Button>
              </HStack>
            </Flex>
          ) : (
            <IconButton
              variant="ghost"
              icon={<FiMenu fontSize="1.25rem" />}
              aria-label="Open Menu"
            />
          )}
        </HStack>
      </Container>
      <Divider />
      <ResourcesSubmenu isOpen={isDesktop && isOpen} />
    </Box>
  );
};

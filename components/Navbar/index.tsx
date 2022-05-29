import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Image,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import * as React from "react";
import { FiMenu } from "react-icons/fi";
import { PopoverIcon } from "../../models/PopoverIcon";
import { Logo } from "../Logo";
import { ResourcesSubmenu } from "./DocumentationSubmenu";
import { ResourcesPopover } from "./ResourcesPopover";

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const lazyRoot = React.useRef(null);
  const { onToggle, isOpen } = useDisclosure({ defaultIsOpen: false });
  return (
    <Box as="nav" bg="bg-surface">
      <Container
        ml={"24px"}
        mr={"24px"}
        ref={lazyRoot}
        py={{ base: "4", lg: "5" }}
        maxWidth="full"
      >
        <HStack spacing="10" justify="space-between">
          <Logo type="Default" size="sm" mr="2rem" />
          {isDesktop ? (
            <Flex justify="space-between" flex="1">
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
              <Spacer />
              <Button
                mr={"1rem"}
                variant="primary"
                onClick={() => {
                  window.location.href = "/auth";
                }}
              >
                Login
              </Button>
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

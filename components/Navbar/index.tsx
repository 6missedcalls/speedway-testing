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
import { Colors } from "../../styles/nebula/colors";
import { Logo } from "../Logo";
import { ResourcesSubmenu } from "./DocumentationSubmenu";
import { ResourcesPopover } from "./ResourcesPopover";


export const Navbar = (props: { style: "light" | "dark" }) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const lazyRoot = React.useRef(null);
  const { onToggle, isOpen } = useDisclosure({ defaultIsOpen: false });
  return (
    <Box
      as="header"
      position="fixed"
      backgroundColor={getBackgroundColor(props.style)}
      w="100%"
      zIndex={1}
    >
      <Container
        ml={"24px"}
        mr={"24px"}
        ref={lazyRoot}
        py={{ base: "4", lg: "5" }}
        maxWidth="full"
        backgroundColor={getBackgroundColor(props.style)}
      >
        <HStack spacing="3" justify="space-between">
          <Logo
            type={props.style == "dark" ? "Dark" : "Default"}
            size="sm"
            mr="2rem"
          />
          {isDesktop ? (
            <Flex justify="space-between" flex="1">
              <Spacer />
              <ButtonGroup variant="link" spacing="8">
                <Button
                  color={props.style == "dark" ? "white" : "black"}
                  onClick={() => {
                    window.location.href = "/cli";
                  }}
                >
                  CLI
                </Button>
                <Button
                  color={props.style == "dark" ? "white" : "black"}
                  variant="link"
                  rightIcon={<PopoverIcon isOpen={isOpen} />}
                  onClick={onToggle}
                >
                  Documentation
                </Button>
                <ResourcesPopover
                  color={props.style == "dark" ? "white" : "black"}
                />
              </ButtonGroup>
              <Spacer />
              <HStack spacing="3">
                <Button
                  color={props.style == "dark" ? "white" : "black"}
                  variant="ghost"
                  onClick={() => {
                    window.location.href = "/auth/signin";
                  }}
                >
                  Login
                </Button>
                <Button
                  mr={"1rem"}
                  variant="primary"
                  onClick={() => {
                    window.location.href = "/register";
                  }}
                >
                  Register
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
      <Divider
        backgroundColor={
          props.style == "dark" ? Colors.neutral700 : Colors.neutral200
        }
      />
      <ResourcesSubmenu isOpen={isDesktop && isOpen} />
    </Box>
  );
};

function getBackgroundColor(style: "light" | "dark") {
  switch (style) {
    case "light":
      return Colors.neutral100;
    case "dark":
      return Colors.neutral800;
  }
}

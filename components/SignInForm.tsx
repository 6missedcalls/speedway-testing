import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  StackProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { Logo } from "./Logo";

export const SignInForm = (props: StackProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6">
        {isMobile && <Logo />}
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
            Log in to your account
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Don't have an account?</Text>
            <Button variant="link" colorScheme="blue">
              Sign up
            </Button>
          </HStack>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" placeholder="Enter your email" type="email" />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" placeholder="********" type="password" />
          </FormControl>
        </Stack>
        <HStack justify="space-between">
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Button variant="link" colorScheme="blue" size="sm">
            Forgot password
          </Button>
        </HStack>
        <Stack spacing="4">
          <Button
            variant="primary"
            onClick={() => {
              window.location.href = "/portal";
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

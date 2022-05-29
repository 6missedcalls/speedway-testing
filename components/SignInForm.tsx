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
import { signIn, useSession } from "next-auth/react";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";

export const SignInForm = (props: StackProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  });

  async function signInWithEmail() {
    return signIn("email", { email });
  }

  async function handleSignIn() {
    await signInWithEmail();
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      return handleSignIn();
    }
  };

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setIsValid(e.target.validity.valid);
    setEmail(e.target.value);
  }

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
            <Input
              name="email"
              type="email"
              id="email"
              autoComplete="home email"
              placeholder="Enter your email"
              value={email}
              onChange={updateEmail}
              onKeyDown={handleKeyDown}
            />
          </FormControl>
        </Stack>
        <HStack justify="space-between">
          <Button variant="link" colorScheme="blue" size="sm">
            Recover account
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

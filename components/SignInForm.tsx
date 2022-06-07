import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Image,
  StackProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import * as React from "react";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Logo } from "./Logo";
import { Colors } from "../styles/nebula/colors";

export const SignInForm = (props: StackProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  });

  // Base64 to ArrayBuffer
  function bufferDecode(value: string) {
    return Buffer.from(value, "base64");
  }

  // ArrayBuffer to URLBase64
  function bufferEncode(value: any) {
    return Buffer.from(value)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  const register = (username: String) => {
    fetch("api/webauthn/register-begin?username=" + username)
      .then((response) => response.json())
      .then((createCredentialOptions) => {
        createCredentialOptions.publicKey.challenge = bufferDecode(
          createCredentialOptions.publicKey.challenge
        );
        createCredentialOptions.publicKey.user.id = bufferDecode(
          createCredentialOptions.publicKey.user.id
        );
        createCredentialOptions.publicKey.user.displayName = username;
        if (createCredentialOptions.publicKey.excludeCredentials) {
          for (
            var i = 0;
            i < createCredentialOptions.publicKey.excludeCredentials.length;
            i++
          ) {
            createCredentialOptions.publicKey.excludeCredentials[i].id =
              bufferDecode(
                createCredentialOptions.publicKey.excludeCredentials[i].id
              );
          }
        }

        navigator.credentials
          .create(createCredentialOptions)
          .then((credential: any) => {
            if (credential === null) {
              return;
            }
            console.log(credential);
            let attestationObject = credential.response.attestationObject;
            let clientDataJSON = credential.response.clientDataJSON;
            let rawId = credential.rawId;

            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: credential.id,
                rawId: bufferEncode(rawId),
                type: credential.type,
                response: {
                  attestationObject: bufferEncode(attestationObject),
                  clientDataJSON: bufferEncode(clientDataJSON),
                },
              }),
            };
            fetch(
              "/api/webauthn/register-finish?username=" + username,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => {
                alert("successfully registered " + username + "!");
              });
          });
      });
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      return register(email);
    }
  };

  function updateEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  return (
    <Stack spacing="8" {...props}>
      <Stack spacing="6">
        {isMobile && <Logo type="White" size="md" />}
        <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
          <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>
            Access with Sonr Account
          </Heading>
          <HStack spacing="1" justify="center">
            <Text color="muted">Don't have an account?</Text>
            <Button
              variant="link"
              color={Colors.secondary3}
              onClick={() => {
                register(email);
              }}
            >
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
              name="did"
              type="email"
              id="did"
              autoComplete="home email"
              placeholder="angelo.snr or Account Address"
              value={email}
              onChange={updateEmail}
            />
          </FormControl>
        </Stack>
        <HStack justify="space-between">
          <Button variant="link" color={Colors.secondary3} size="sm">
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

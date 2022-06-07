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
import { Logo } from "./Logo";
import { Colors } from "../styles/nebula/colors";

export const SignInForm = (props: StackProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [did, setDid] = useState("");
  const [label, setLabel] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Base64 to ArrayBuffer
  function bufferDecode(value: string) {
    return Buffer.from(value, "base64");
  }

  const getOs = () => {
    const os = ["Windows", "Linux", "Macintosh"]; // add your OS values
    const userAgent = navigator.userAgent;
    for (let i = 0; i < os.length; i++) {
      if (userAgent.indexOf(os[i]) > -1) {
        return os[i];
      }
    }
    return "Unknown";
  };

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
              "/api/webauthn/register-finish?username=" +
                username +
                "&os=" +
                getOs() +
                "&label=" +
                label,
              requestOptions
            )
              .then((response) => response.json())
              .then((data) => {
                alert("successfully registered " + username + "!");
              });
          });
      });
  };
  function updateDid(e: ChangeEvent<HTMLInputElement>) {
    setDid(e.target.value);
  }

  function updateLabel(e: ChangeEvent<HTMLInputElement>) {
    setLabel(e.target.value);
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
            <Text color="muted">Already have an account?</Text>
            <Button
              variant="link"
              color={Colors.secondary3}
              onClick={() => {
                // Change to portal page
                window.location.href = "/portal";
              }}
            >
              Sign In
            </Button>
          </HStack>
        </Stack>
      </Stack>
      <Stack spacing="6">
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="email">Sonr ID</FormLabel>
            <Input
              name="did"
              type="text"
              id="did"
              autoComplete="home email"
              placeholder="angelo.snr or Account Address"
              value={did}
              onChange={updateDid}
            />
            <FormLabel htmlFor="email">Device Label</FormLabel>
            <Input
              name="label"
              type="text"
              id="label"
              placeholder="Angelo's iPhone"
              value={label}
              onChange={updateLabel}
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
              register(did);
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

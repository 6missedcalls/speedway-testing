import type { NextPage } from "next";
import {
  Box,
  Circle,
  Flex,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import {
  BiBuoy,
  BiCog,
  BiBox,
  BiCommentAdd,
  BiCreditCard,
  BiEnvelope,
  BiGridAlt,
  BiHdd,
  BiNews,
  BiBookAdd,
  BiPurchaseTagAlt,
  BiRecycle,
  BiRedo,
  BiUserCircle,
  BiCodeCurly,
  BiBarChart,
  BiBoltCircle,
  BiWind,
  BiWallet,
} from "react-icons/bi";
import { AccountSwitcher } from "./AccountSwitcher";
import { NavGroup } from "./NavGroup";
import { useRouter } from "next/router";
import { NavItem } from "./NavItem";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <Box w="64" bg="gray.900" color="white" fontSize="sm">
      <Flex h="full" direction="column" px="4" py="4">
        <AccountSwitcher />
        <Stack spacing="8" flex="1" overflow="auto" pt="8">
          <Stack spacing="1">
            <NavItem
              active={router.pathname == "/portal"}
              href="/portal"
              icon={<BiGridAlt />}
              label="Dashboard"
            />
          </Stack>
          <NavGroup label="Modules">
            <NavItem
              icon={<BiUserCircle />}
              label="Registry"
              active={router.pathname == "/portal/registry"}
              href="/portal/registry"
            />
            <NavItem
              icon={<BiCodeCurly />}
              label="Objects"
              active={router.pathname == "/portal/objects"}
              href="/portal/objects"
            />
            <NavItem
              icon={<BiBox />}
              label="Buckets"
              active={router.pathname == "/portal/buckets"}
              href="/portal/buckets"
            />
            <NavItem
              icon={<BiWind />}
              label="Channels"
              active={router.pathname == "/portal/channels"}
              href="/portal/channels"
            />
            <NavItem
              icon={<BiHdd />}
              label="Storage"
              active={router.pathname == "/portal/storage"}
              href="/portal/storage"
            />
          </NavGroup>

          <NavGroup label="Tools">
            <NavItem icon={<BiBarChart />} label="Block Explorer" />
            <NavItem icon={<BiBookAdd />} label="DID Utility" />
            <NavItem icon={<BiBoltCircle />} label="Motor Plugins" />
          </NavGroup>
        </Stack>
        <Box>
          <Stack spacing="1">
            <NavItem subtle icon={<BiCog />} label="Settings" />
            <NavItem
              subtle
              icon={<BiBuoy />}
              label="Docs & Support"
              endElement={<Circle size="2" bg="blue.400" />}
              href="https://docs.sonr.io"
            />
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

import type { NextPage } from "next";
import {
  Flex,
} from "@chakra-ui/react";
import * as React from "react";
import { Sidebar } from '../../../components/Sidebar';

const Home: NextPage = () => {
  return (
    <main>
      <Flex as="section" minH="100vh" bg="bg-canvas">
        <Sidebar />
      </Flex>
    </main>
  );
};

export default Home;

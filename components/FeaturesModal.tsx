import {
  Box,
  BoxProps,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  UseDisclosureProps,
} from "@chakra-ui/react";
import * as React from "react";

export const FeaturesModal = (
  props: UseDisclosureProps & {
    title: string;
    description: string;
  }
) => {
  const { isOpen, onOpen, onClose } = props;
  return (
    <Modal
      isOpen={isOpen ?? false}
      onClose={onClose ?? handleClose}
      isCentered={true}
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{props.description}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

function handleClose() {
  console.log("Modal");
}

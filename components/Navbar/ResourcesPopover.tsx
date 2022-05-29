import {
  Button,
  Icon,
  Link,
  Popover,
  PopoverProps,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { items } from "../../models/resourceData";
import { PopoverIcon } from "../../models/PopoverIcon";

export const ResourcesPopover = () => (
  <Popover
    trigger="hover"
    openDelay={0}
    placement="bottom"
    defaultIsOpen={false}
    gutter={12}
  >
    {({ isOpen }) => (
      <>
        <PopoverTrigger>
          <Button variant="link" rightIcon={<PopoverIcon isOpen={isOpen} />}>
            Resources
          </Button>
        </PopoverTrigger>
        <PopoverContent p="5" width={{ base: "sm", md: "2xl" }}>
          <SimpleGrid columns={{ base: 1, md: 2 }} columnGap="6" rowGap="2">
            {items.map((item, id) => (
              <Link variant="menu" href={item.href} key={id}>
                <Stack spacing="4" direction="row" p="3">
                  <Icon as={item.icon} boxSize="6" color="accent" />
                  <Stack spacing="1">
                    <Text fontWeight="medium">{item.title}</Text>
                    <Text fontSize="sm" color="muted">
                      {item.description}
                    </Text>
                  </Stack>
                </Stack>
              </Link>
            ))}
          </SimpleGrid>
        </PopoverContent>
      </>
    )}
  </Popover>
);

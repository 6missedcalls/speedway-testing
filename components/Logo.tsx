import { Image } from "@chakra-ui/react";
import * as React from "react";

export const Logo = (props: {
  type: "Default" | "Dark" | "White" | "Black";
  size: "sm" | "md" | "lg" | "xl";
  mr?: string;
  mb?: string;
}) => (
  <Image
    onClick={() => {
      window.location.href = "/";
    }}
    height={getHeightFromSize(props.size)}
    src={getSrcFromType(props.type)}
    cursor="pointer"
    alt="Sonr Logo"
    mr={props.mr}
    mb={props.mb}
  />
);

function getHeightFromSize(size: "sm" | "md" | "lg" | "xl") {
  switch (size) {
    case "sm":
      return "42px";
    case "md":
      return "64px";
    case "lg":
      return "72px";
    case "xl":
      return "80px";
  }
}

function getSrcFromType(type: "Default" | "Dark" | "White" | "Black") {
  switch (type) {
    case "Default":
      return "/logo/Highway.png";
    case "Dark":
      return "/logo/Highway-Dark.png";
    case "White":
      return "/logo/Highway-White.png";
    case "Black":
      return "/logo/Highway-Black.png";
  }
}

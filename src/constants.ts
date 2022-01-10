import { Dimensions } from "react-native";
import { SocialIconProps } from "react-native-elements";

const dimensions = Dimensions.get("screen");

export const HIGHER_8_DEVICE = dimensions.height > 667;

export const socialIcons: SocialIconProps["type"][] = [
  "facebook",
  "twitter",
  "linkedin",
  "instagram",
];

import { Dimensions } from "react-native";

const dimensions = Dimensions.get("screen");

export const HIGHER_8_DEVICE = dimensions.height > 667;

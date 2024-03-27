import React from "react";

export type Browser =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "ie"
  | "opera"
  | "unknown";

// Initialize the context with default values
const BrowserContext = React.createContext<Browser>("unknown");

export default BrowserContext;

import { useContext } from "react";
import { RootLayoutContext, RootLayoutType } from "../layouts/RootLayout/Layout";

export const useRootLayout = (): RootLayoutType => useContext(RootLayoutContext);
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = unknown> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

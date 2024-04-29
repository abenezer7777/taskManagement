"use client";
import React, { Children, FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
interface QueryProviderProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

const QueryProvider: FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;

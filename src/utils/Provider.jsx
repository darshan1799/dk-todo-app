"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>
      </QueryClientProvider>
    </>
  );
}

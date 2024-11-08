'use client';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export default function ClerkClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={"pk_test_Y29tcGxldGUtY3JhYi0yOS5jbGVyay5hY2NvdW50cy5kZXYk"!}
    >
        {children}
    </ClerkProvider>
  );
}

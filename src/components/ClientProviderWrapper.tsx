'use client';
import { CustomerProvider } from '@/context/CustomerContext';

export default function ClientProviderWrapper({ children }: { children: React.ReactNode }) {
  console.log('ClientProviderWrapper rendered');
  return <CustomerProvider>{children}</CustomerProvider>;
}
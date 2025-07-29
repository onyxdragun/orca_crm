'use client';
import Link from 'next/link';
import React from 'react';
import { useCustomer } from '@/context/CustomerContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {

  const { customerId } = useCustomer();

  return (
    <nav className="mb-6 text-sm text-gray-400">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.href ? (
            <Link href={
              customerId && item.href
                ? `${item.href}?id=${customerId}`
                : item.href || '#'
            }
              className="hover:underline">{item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
          {idx < items.length - 1 && ' > '}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;

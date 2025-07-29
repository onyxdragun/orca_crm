'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import Modal from '@/components/Modal';
import TicketList from '@/components/TicketList';
import CustomerInfoCard from '@/components/CustomerInfoCard';
import LoginHeader from '@/components/LoginHeader';
import Breadcrumb from '@/components/Breadcrumb';
import NewTicketForm from '@/components/NewTicketForm';
import CustomerDeviceList from '@/components/CustomerDeviceList';
import { useCustomer } from '@/context/CustomerContext';
import {Customer} from '@/types/index';
import { Ticket } from '@/types/ticket';

export default function CustomerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');
  const [customer, setCustomer] = useState<Customer | undefined>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const { setCustomerId } = useCustomer();

  useEffect(() => {
    async function fetchData() {
      if (!customerId) return;
      const res = await fetch(`/api/customers/${customerId}`);
      const data = await res.json();

      setCustomerId(Number(customerId))
      setCustomer(data.customer);
      setTickets(data.tickets);
      setLoading(false);
    }
    if (customerId) fetchData();
  }, [customerId, setCustomerId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!customer) return <div className="text-center py-8">Customer not found.</div>;

  return (
    <>
      <LoginHeader onLogin={() => { }} isLoggedIn={true} onLogout={() => { }} />
      <div className="max-w-4xl w-full mx-auto p-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Customers', href: '/customers' },
            { label: `${customer.first_name} ${customer.last_name}` }
          ]}
        />
        <h2 className="text-2xl font-bold mb-4">{customer.first_name} {customer.last_name}</h2>
        <div className="w-full mb-6">
          <CustomerInfoCard
            customer={customer}
            onSave={async (updated: Partial<Customer>) => {
              const res = await fetch(`/api/customers/${customer!.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
              });
              if (res.ok) {
                setCustomer((prev) => prev ? { ...prev, ...updated } : prev);
              }
            }}
          />
        </div>

        <TicketList<Ticket>
          tickets={tickets}
          onNewTicket={() => {
            if (customer && customer.id) {
              setShowNewTicket(true);
            } else {
              alert('Customer not loaded yet. Please wait.');
            }
          }}
          customerName={params.name as string}
        />
        <button
          className="hidden"
          disabled={!customer || !customer.id}
          aria-hidden="true"
        />
        {showNewTicket && customer && customer.id && (
          <Modal isOpen={showNewTicket} onClose={() => setShowNewTicket(false)}>
            <NewTicketForm
              customerId={customer.id}
              onCreated={async () => {
                setShowNewTicket(false);
                setLoading(true);
                const res = await fetch(`/api/customers/${customerId}`);
                const data = await res.json();
                setTickets(data.tickets);
                setLoading(false);
              }}
            />
          </Modal>
        )}
        <CustomerDeviceList customerId={customer.id} />
      </div>
    </>
  );
}

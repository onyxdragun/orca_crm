'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TicketWithCustomer } from '@/types/ticket';
import LoginHeader from '@/components/LoginHeader';
import TicketList from '@/components/TicketList';
import Modal from '@/components/Modal';
import NewTicketForm from '@/components/NewTicketForm';
import { transformTicketWithCustomerInput } from '@/utils/typeGuards';


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<TicketWithCustomer[]>([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setIsLoggedIn(false);
    window.location.reload();
  }

  async function handleLogin(username: string, password: string) {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // ensure cookies are sent
      });
      if (res.ok) {
        // After login, check /api/me for auth status
        const meRes = await fetch('/api/me', { credentials: 'include' });
        const meData = await meRes.json();
        if (meRes.ok && meData.loggedIn) {
          setIsLoggedIn(true);
        } else {
          alert('Login failed');
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Login failed');
      }
    } catch {
      alert('Login error');
    }
  }

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch('/api/me', { credentials: 'include' });
      const data = await res.json();
      setIsLoggedIn(res.ok && data.loggedIn);
    }
    checkLogin();
  }, []);

  useEffect(() => {
    async function fetchTickets() {
      if (!isLoggedIn) return;
      const res = await fetch('/api/tickets?status=!closed&limit=5');
      const data = await res.json();
      const tickets = data.map(transformTicketWithCustomerInput);
      console.log("Tickets:" , tickets);
      setTickets(tickets);
    }
    fetchTickets();
  }, [isLoggedIn]);

  return (
    <>
      <LoginHeader onLogin={handleLogin} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <main className="flex flex-col justify-center min-h-[80vh] p-4 bg-transparent w-full max-w-full md:max-w-4xl md:mx-auto">
        {isLoggedIn ? (
          <>
            <TicketList<TicketWithCustomer>
              tickets={tickets}
              onNewTicket={() => setShowNewTicketModal(true)}
              customerName={''}
              showCustomerName={true}
              title="Recent Tickets"
              onSelectTicket={ticket => {
                // Use ticket.customer_name if available, else fallback
                let customerName = ticket.customer_name || '';
                customerName = customerName.replace(/\s+/g, '-');
                if (ticket.ticket_number) {
                  router.push(`/customer/${customerName}/ticket/${ticket.ticket_number}`);
                }
              }}
            />
            <Modal isOpen={showNewTicketModal} onClose={() => setShowNewTicketModal(false)}>
              <NewTicketForm customerId={0} onCreated={() => setShowNewTicketModal(false)} />
            </Modal>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">Orca CRM</h1>
            <p className="text-lg mb-6 max-w-xl">
              Welcome to Orca CRM — a simple, private customer relationship management system designed for personal use. Track customers, tickets, and worklogs with a clean interface and secure authentication.
            </p>
            <ul className="text-left max-w-md mx-auto list-disc list-inside mb-8">
              <li>Manage customer details and status (lead, current, inactive)</li>
              <li>Track tickets and helpdesk requests</li>
              <li>Log work and hours for each ticket</li>
              <li>Secure login with JWT authentication</li>
              <li>Powered by Next.js, React, TypeScript, Tailwind CSS, and MariaDB</li>
            </ul>
            <span className="text-sm text-gray-300 mb-8">Made for orcaisletech.com</span>
            <div className="mt-8 text-lg text-gray-300">Please log in to access Orca CRM.</div>
          </>
        )}
      </main>
    </>
  );
}

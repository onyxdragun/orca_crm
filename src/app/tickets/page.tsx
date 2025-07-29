"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { transformTicketWithCustomerInput } from "@/utils/typeGuards";
import {  TicketWithCustomer } from "@/types/ticket";
import TicketList from "@/components/TicketList";
import LoginHeader from "@/components/LoginHeader";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketWithCustomer[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const hideNewTicket = true;

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
      const res = await fetch('/api/tickets?sort=created_at_desc');
      const data = await res.json();
      const tickets = data.map(transformTicketWithCustomerInput);
      setTickets(tickets);
    }
    fetchTickets();
  }, []);

  return (
    <>
      <LoginHeader isLoggedIn={isLoggedIn} onLogin={() => {}} onLogout={() => setIsLoggedIn(false)} />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">All Tickets</h1>
        <TicketList<TicketWithCustomer>
          tickets={tickets}
          showCustomerName={true}
          onNewTicket={() => {}}
          customerName={''}
          onSelectTicket={ticket => {
            let customerName = ticket.customer_name || '';
            customerName = customerName.replace(/\s+/g, '-');
            if (ticket.ticket_number) {
              router.push(`/customer/${customerName}/ticket/${ticket.ticket_number}`);
            }
          }}
          hideNewTicket={hideNewTicket}
        />
      </main>
    </>
  );
}

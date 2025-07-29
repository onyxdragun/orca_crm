"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCustomer } from "@/context/CustomerContext";
import { transformTicketInput } from "@/utils/typeGuards";
import TaskList from "@/components/TaskList";
import Breadcrumb from "@/components/Breadcrumb";
import LoginHeader from "@/components/LoginHeader";
import TicketInfo from '@/components/TicketInfo';
import DeviceCard from '@/components/DeviceCard';
import DeviceModal from '@/components/DeviceModal';

import { Ticket, Device, TicketFormData } from "@/types/ticket";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket>();
  const [loading, setLoading] = useState(true);
  const [ticketTypes, setTicketTypes] = useState<{ id: number, name: string, description?: string }[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | undefined>(undefined);
  const { customerId, setCustomerId } = useCustomer();

  useEffect(() => {
    async function fetchTicket() {
      const res = await fetch(`/api/tickets/by-number/${params.ticketnumber}`);
      if (res.ok) {
        const data = await res.json();
        const ticket = transformTicketInput(data);
        setTicket(ticket);
        if (!customerId) setCustomerId(ticket.customer_id || 0);
      }
      setLoading(false);
    }
    async function fetchTypes() {
      const res = await fetch('/api/ticket_types');
      if (res.ok) setTicketTypes(await res.json());
    }
    async function fetchDevices() {
  
      if (customerId) {
        const res = await fetch(`/api/customers/${customerId}/devices`);
        console.log("fetchDevices: ", res);
        if (res.ok) setDevices(await res.json());
      }
    }
    if (params.ticketnumber) {
      fetchTicket();
      fetchTypes();
      fetchDevices();
    }
  }, [params.ticketnumber, customerId, setCustomerId]);

  async function handleSave(formData: TicketFormData) {
    const res = await fetch(`/api/tickets/by-number/${params.ticketnumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: formData.subject,
        status: formData.status,
        due_at: formData.due,
        description: formData.description,
        ticket_type_id: formData.ticketTypeId || null,
        device_id: formData.deviceId || null,
        priority: formData.priority,
      }),
    });
    if (res.ok) {
      setLoading(true);
      const updated = await res.json();
      setTicket(updated);
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!ticket) return <div className="text-center py-8">Ticket not found.</div>;

  const ticketDevice = devices.find(d => d.equipment_id === ticket.device_id) || null;

  return (
    <>
      <LoginHeader onLogin={() => { }} isLoggedIn={true} onLogout={() => router.push("/")} />
      <div className="max-w-3xl w-full mx-auto p-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Customers", href: "/customers" },
            { label: params.name as string, href: `/customer/${params.name}` },
            { label: ticket.ticket_number }
          ]}
        />
        <h2 className="text-2xl font-bold mb-4">Ticket: {ticket.ticket_number}</h2>
        <TicketInfo
          ticket={ticket}
          ticketTypes={ticketTypes}
          devices={devices}
          onSave={handleSave}
        />

        {ticketDevice && (
          <DeviceCard
            device={ticketDevice}
            onEdit={d => {
              setEditDevice(d);
              setShowDeviceModal(true);
            }}
          />
        )}

        <DeviceModal
          isOpen={showDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          onSave={async (device) => {
            await fetch(`/api/devices/${device.equipment_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(device),
            });
            setShowDeviceModal(false);
            setEditDevice(undefined);
            // Refresh ticket/device info
            const res = await fetch(`/api/tickets/by-number/${params.ticketnumber}`);
            if (res.ok) setTicket(await res.json());
            // Also refresh devices
            if (params.name) {
              const res2 = await fetch(`/api/customers/${customerId}/devices`);
              if (res2.ok) setDevices(await res2.json());
            }
          }}
          device={editDevice}
        />
        <TaskList ticketId={ticket.id} />
      </div>
    </>
  );
}

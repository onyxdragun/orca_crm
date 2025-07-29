// hooks/useTicketEditor.ts
import { useState } from 'react';
import { Ticket, TicketFormData } from '@/types/ticket';

export const useTicketEditor = (ticket: Ticket) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    subject: ticket.subject || '',
    status: ticket.status,
    due: ticket.due_at ? new Date(ticket.due_at).toISOString().slice(0, 16) : '',
    description: ticket.description || '',
    ticketTypeId: ticket.ticket_type_id || '',
    deviceId: ticket.device_id || '',
    priority: ticket.priority,
  });

  const updateField = <K extends keyof TicketFormData>(
    field: K, 
    value: TicketFormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = (): void => {
    setFormData({
      subject: ticket.subject || '',
      status: ticket.status,
      due: ticket.due_at ? new Date(ticket.due_at).toISOString().slice(0, 16) : '',
      description: ticket.description || '',
      ticketTypeId: ticket.ticket_type_id || '',
      deviceId: ticket.device_id || '',
      priority: ticket.priority,
    });
  };

  const startEditing = (): void => {
    resetForm();
    setEditing(true);
  };

  const cancelEditing = (): void => {
    resetForm();
    setEditing(false);
  };

  return {
    editing,
    formData,
    updateField,
    startEditing,
    cancelEditing,
    setEditing,
  };
};
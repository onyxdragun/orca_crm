'use client';
import React, { useState } from 'react';

interface NewTicketFormProps {
  customerId: number;
  onCreated: () => void;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ customerId, onCreated }) => {

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [completedAt, ] = useState<string | undefined>(undefined);
  const [ticketTypeId, setTicketTypeId] = useState<number | ''>('');
  const [ticketTypes, setTicketTypes] = useState<{ id: number, name: string, description?: string }[]>([]);

  const [dueAt, setDueAt] = useState<string>('');

  React.useEffect(() => {
    async function generateTicketNumber() {
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      // Fetch count of tickets for today
      const res = await fetch(`/api/tickets/count?date=${dateStr}`, { credentials: 'include' });
      const data = await res.json();
      const count = (data.count || 0) + 1;
      setTicketNumber(`OIT_${dateStr}_${String(count).padStart(3, '0')}`);
    }
    generateTicketNumber();
  }, [customerId]);

  React.useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await fetch('/api/ticket_types', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setTicketTypes(data);
        }
      } catch {
        // Optionally handle error
      }
    }
    fetchTypes();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId || customerId === 0) {
      setError('Please select a customer.');
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }
    if (!priority) {
      setError('Priority is required.');
      return;
    }
    if (!ticketTypeId) {
      setError('Type is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customerId, subject, description, priority, ticket_number: ticketNumber, completed_at: completedAt, ticket_type_id: ticketTypeId || null, due_at: dueAt || null }),
        credentials: 'include',
      });
      if (res.ok) {
        setSubject('');
        setDescription('');
        onCreated();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create ticket');
      }
    } catch {
      setError('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className=" p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      <h4 className="text-lg font-semibold mb-2">New Ticket</h4>
      <div className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor="ticketNumber" className="font-semibold text-gray-300 col-span-1 text-right">Ticket:</label>
        <input
          id="ticketNumber"
          type="text"
          value={ticketNumber}
          readOnly
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full col-span-2"
          placeholder="Ticket Number"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor="subject" className="font-semibold text-gray-300 col-span-1 text-right">Subject:</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          className="p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 w-full col-span-2"
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor="priority" className="font-semibold text-gray-300 col-span-1 text-right">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full col-span-2"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor="ticketType" className="font-semibold text-gray-300 col-span-1 text-right">Type:</label>
        <select
          id="ticketType"
          value={ticketTypeId}
          onChange={e => setTicketTypeId(Number(e.target.value))}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full col-span-2"
        >
          <option value="">Select type</option>
          {ticketTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <label htmlFor="dueAt" className="font-semibold text-gray-300 col-span-1 text-right">Due At:</label>
        <input
          id="dueAt"
          type="datetime-local"
          value={dueAt}
          onChange={e => setDueAt(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full col-span-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="font-semibold text-gray-300 block mb-1">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          className="p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 min-h-[80px] w-full"
          required
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 px-3 py-1 rounded text-white w-full cursor-pointer" disabled={loading}>
          {loading ? 'Saving Ticket...' : 'Create Ticket'}
        </button>
      </div>
      {error && <span className="text-red-400">{error}</span>}
    </form>
  );
};

export default NewTicketForm;

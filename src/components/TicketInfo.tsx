// components/TicketInfo.tsx
import React from 'react';
import { getDueDays } from '@/utils/dateUtils';
import { useTicketEditor } from '@/hooks/useTicketEditor';
import { getPriorityDisplay, getStatusDisplay, getLocationDisplay } from '@/utils/ticketDisplayUtils';
import TicketForm from './TicketForm';
import { 
  Ticket, 
  TicketType, 
  Device, 
  TicketFormData, 
  DueDaysResult 
} from '@/types/ticket';

interface DisplayFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const DisplayField: React.FC<DisplayFieldProps> = ({ label, children, className = "" }) => (
  <div className={className}>
    <span className="font-semibold text-gray-300">{label}:</span> {children}
  </div>
);

interface DueDateDisplayProps {
  dueAt?: string | undefined;
}

const DueDateDisplay: React.FC<DueDateDisplayProps> = ({ dueAt }) => {
  if (!dueAt) {
    return <span className="italic text-gray-500">None</span>;
  }

  const due: DueDaysResult | null = getDueDays(dueAt);
  const dueDateText = new Date(dueAt).toLocaleString();
  
  return (
    <>
      {dueDateText}
      {due && (
        <span className={due.isOverdue ? "ml-2 text-sm text-red-400" : "ml-2 text-sm text-gray-400"}>
          ({due.text})
        </span>
      )}
    </>
  );
};

interface TicketInfoProps {
  ticket: Ticket;
  ticketTypes: TicketType[];
  devices: Device[];
  onSave: (formData: TicketFormData) => Promise<void>;
}

const TicketInfo: React.FC<TicketInfoProps> = ({ ticket, ticketTypes, devices, onSave }) => {
  const { editing, formData, updateField, startEditing, cancelEditing } = useTicketEditor(ticket);

  const handleSave = async (formData: TicketFormData) => {
    try {
      await onSave(formData);
      cancelEditing();
    } catch (error: unknown) {
      console.error('Error saving ticket:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      {editing ? (
        <TicketForm
          formData={formData}
          updateField={updateField}
          ticketTypes={ticketTypes}
          devices={devices}
          onSave={handleSave}
          onCancel={cancelEditing}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DisplayField label="Subject">
            {ticket.subject}
          </DisplayField>

          <DisplayField label="Status" className="flex items-center">
            {getStatusDisplay(ticket.status)}
          </DisplayField>

          <DisplayField label="Created">
            {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ''}
          </DisplayField>

          <DisplayField label="Due">
            <DueDateDisplay dueAt={ticket.due_at} />
          </DisplayField>

          <DisplayField label="Type">
            {ticket.ticket_type_name || ticket.ticket_type_id || 'N/A'}
          </DisplayField>

          <DisplayField label="Priority">
            {getPriorityDisplay(ticket.priority)}
          </DisplayField>

          <DisplayField label="Estimate">
            {ticket.estimated_cost || '$0.00'}
          </DisplayField>

          <DisplayField label="Location" className="flex items-center">
            {getLocationDisplay(ticket.location)}
          </DisplayField>

          <div className="md:col-span-2">
            <span className="font-semibold text-gray-300 block mb-2">Description:</span>
            <div className="border rounded border-gray-700 bg-gray-900 p-2 m-.5 text-gray-200">
              {ticket.description}
            </div>
          </div>

          <div className="md:col-span-2">
            <button 
              className="bg-blue-600 px-4 py-2 rounded text-white font-semibold cursor-pointer mt-2" 
              onClick={startEditing}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketInfo;
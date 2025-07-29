import React from "react";
import { FaMinus, FaChevronUp, FaArrowUp } from 'react-icons/fa';

import { Device, Ticket } from '@/types/ticket';

interface TicketType {
  id: number;
  name: string;
  description?: string;
}

interface CustomerInfoProps {
  ticket: Ticket;
  editing: boolean;
  ticketTypes: TicketType[];
  editSubject: string;
  editStatus: string;
  editDue: string;
  editDescription: string;
  editTicketTypeId: number | '';
  editPriority: string;
  setEditSubject: (v: string) => void;
  setEditStatus: (v: string) => void;
  setEditDue: (v: string) => void;
  setEditDescription: (v: string) => void;
  setEditTicketTypeId: (v: number | '') => void;
  setEditing: (v: boolean) => void;
  handleSave: () => void;
  devices: Device[];
  editDeviceId: number | '';
  setEditDeviceId: (v: number | '') => void;
  setEditPriority: (v: string) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  ticket,
  editing,
  ticketTypes,
  editSubject,
  editStatus,
  editDue,
  editDescription,
  editTicketTypeId,
  editPriority,
  setEditSubject,
  setEditStatus,
  setEditDue,
  setEditDescription,
  setEditTicketTypeId,
  setEditing,
  handleSave,
  devices,
  editDeviceId,
  setEditDeviceId,
  setEditPriority,
}) => {
  // Helper to camelcase and icon for priority
  const getPriorityDisplay = (priority: string) => {
    let icon = null;
    let label = '';
    switch (priority) {
      case 'low':
        icon = <FaMinus className="inline text-yellow-400 mr-1" />;
        label = 'Low';
        break;
      case 'normal':
        icon = <FaChevronUp className="inline text-green-400 mr-1" />;
        label = 'Normal';
        break;
      case 'high':
        icon = <FaArrowUp className="inline text-red-500 mr-1" />;
        label = 'High';
        break;
      default:
        label = priority;
    }
    return <span>{icon}{label}</span>;
  };

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      {editing ? (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Subject</label>
            <input
              type="text"
              value={editSubject}
              onChange={e => setEditSubject(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Status</label>
            <select
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Due</label>
            <input
              type="datetime-local"
              value={editDue}
              onChange={e => setEditDue(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Priority</label>
            <select
              value={editPriority}
              onChange={e => setEditPriority(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 font-semibold mb-1">Description</label>
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Type</label>
            <select
              value={editTicketTypeId}
              onChange={e => setEditTicketTypeId(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="">Select type</option>
              {ticketTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Device</label>
            <select
              value={editDeviceId}
              onChange={e => setEditDeviceId(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value="">Select device</option>
              {devices.map(device => (
                <option key={device.equipment_id} value={device.equipment_id}>
                  {device.device_type_name ? `${device.device_type_name} - ${device.brand_model}` : device.brand_model}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-end md:col-span-2">
            <button type="button" className="bg-green-600 px-4 py-2 rounded text-white font-semibold cursor-pointer" onClick={handleSave}>Save</button>
            <button type="button" className="bg-gray-600 px-4 py-2 rounded text-white font-semibold cursor-pointer" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-semibold text-gray-300">Subject:</span> {ticket.subject}</div>
          <div><span className="font-semibold text-gray-300">Status:</span> {ticket.status}</div>
          <div><span className="font-semibold text-gray-300">Created:</span> {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ''}</div>
          <div><span className="font-semibold text-gray-300">Due:</span> {ticket.due_at ? new Date(ticket.due_at).toLocaleString() : <span className="italic text-gray-500">None</span>}</div>
          <div className="md:col-span-2"><span className="font-semibold text-gray-300">Description:</span> {ticket.description}</div>
          <div><span className="font-semibold text-gray-300">Type:</span> {ticket.ticket_type_name || ticket.ticket_type_id || 'N/A'}</div>
          <div><span className="font-semibold text-gray-300">Priority:</span> {getPriorityDisplay(ticket.priority ?? '')}</div>
          <div className="md:col-span-2">
            <button className="bg-blue-600 px-4 py-2 rounded text-white font-semibold cursor-pointer mt-2" onClick={() => setEditing(true)}>Edit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInfo;

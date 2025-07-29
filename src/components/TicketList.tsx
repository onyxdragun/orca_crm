'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiChevronsUp, BiChevronDown, BiChevronUp } from "react-icons/bi";

import { getDueDays, getDaysSince } from '@/utils/dateUtils';
import {isTicketWithCustomer} from '@/utils/typeGuards';  
import { Ticket } from '@/types/ticket';

interface TicketListProps<T extends Ticket> {
  tickets: T[];
  onNewTicket: () => void;
  onSelectTicket?: (ticket: T) => void;
  customerName: string;
  showCustomerName?: boolean;
  hideNewTicket?: boolean;
  title?: string;
}

const TicketList = <T extends Ticket>({
  tickets,
  onNewTicket,
  onSelectTicket,
  customerName,
  showCustomerName = false,
  hideNewTicket = false,
  title = "Tickets"
}: TicketListProps<T>) => {
  const router = useRouter();

  useEffect(() => {
  }, [tickets]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {!hideNewTicket && (
          <button
            className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 hover:from-gray-800 hover:to-black rounded-lg py-2 px-4 font-bold text-base text-white shadow-lg border border-white transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 active:scale-95 hover:scale-105"
            onClick={onNewTicket}
          >
            New Ticket
          </button>
        )}
      </div>
      {tickets.length === 0 ? (
        <p>No tickets found for this customer.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* Mobile: Cards, Desktop: Table */}
          <div className="block md:hidden space-y-4 w-full">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-[#101624] rounded-xl shadow-lg p-4 cursor-pointer hover:bg-gray-700 transition border border-blue-950 w-full"
                onClick={() => {
                  if (onSelectTicket) {
                    onSelectTicket(ticket);
                  } else {
                    router.push(`/customer/${customerName}/ticket/${ticket.ticket_number}`);
                  }
                }}
              >
                {showCustomerName && isTicketWithCustomer(ticket) && (
                  <div className="text-blue-200 font-semibold mb-1">{ticket.customer_name || `${ticket.customer_first_name || ''} ${ticket.customer_last_name || ''}`.trim()}</div>
                )}
                <div className="font-bold text-white text-lg mb-1">{ticket.subject}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${ticket.status === 'open' ? 'bg-green-700 text-green-100' : 'bg-gray-600 text-gray-200'}`}>{ticket.status}</span>
                  {ticket.priority === 'high' && <BiChevronsUp className="inline text-red-500" title="High Priority" />}
                  {ticket.priority === 'normal' && <BiChevronUp className="inline text-green-400" title="Medium Priority" />}
                  {ticket.priority === 'low' && <BiChevronDown className="inline text-yellow-400" title="Low Priority" />}
                </div>
                <div className="text-blue-300 text-sm mb-1">Created: {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ''}</div>
                <div className="text-blue-300 text-sm mb-1">Due: {ticket.due_at ? new Date(ticket.due_at).toLocaleString() : <span className="italic text-gray-500">None</span>}</div>
                <div className="text-blue-400 font-semibold text-sm">Tasks: {ticket.task_count ?? 0}</div>
              </div>
            ))}
          </div>
          <table className="hidden md:table min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-900">
                {showCustomerName && <th className="px-4 py-2 text-left text-gray-300">Customer</th>}
                <th className="px-4 py-2 text-left text-gray-300">Subject</th>
                <th className="px-4 py-2 text-center text-gray-300">Status</th>
                <th className="px-4 py-2 text-center text-gray-300">Priority</th>
                <th className="px-4 py-2 text-left text-gray-300">Created</th>
                <th className="px-4 py-2 text-left text-gray-300">Due</th>
                <th className="px-4 py-2 text-center text-blue-300">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => {
                    if (onSelectTicket) {
                      onSelectTicket(ticket);
                    } else {
                      router.push(`/customer/${customerName}/ticket/${ticket.ticket_number}`);
                    }
                  }}
                >
                  {showCustomerName && isTicketWithCustomer(ticket) && (
                    <td className="px-4 py-2 text-left text-gray-200">
                      {ticket.customer_name || `${ticket.customer_first_name || ''} ${ticket.customer_last_name || ''}`.trim()}
                    </td>
                  )}
                  <td className="px-4 py-2 font-medium text-white">{ticket.subject}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${ticket.status === 'open'
                        ? 'bg-green-700 text-green-100'
                        : 'bg-gray-600 text-gray-200'
                      }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {ticket.priority === 'high' && <BiChevronsUp className="inline text-red-500" title="High Priority" />}
                    {ticket.priority === 'normal' && <BiChevronUp className="inline text-green-400" title="Medium Priority" />}
                    {ticket.priority === 'low' && <BiChevronDown className="inline text-yellow-400" title="Low Priority" />}
                  </td>

                  <td className="px-4 py-2 text-gray-300 text-center">
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : ''}
                    {ticket.created_at && <><br /><span className="text-xs text-gray-400">{getDaysSince(ticket.created_at)}</span></>}
                  </td>
                  <td className="px-4 py-2 text-gray-300 text-center">
                    {ticket.due_at ? new Date(ticket.due_at).toLocaleString() : <span className="italic text-gray-500">None</span>}
                    {ticket.due_at && (() => {
                      const due = getDueDays(ticket.due_at);
                      if (!due) return null;
                      return <><br /><span className={due.isOverdue ? "text-xs text-red-400" : "text-xs text-gray-400"}>{due.text}</span></>;
                    })()}
                  </td>
                  <td className="px-4 py-2 text-blue-300 font-semibold text-center">{ticket.task_count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketList;

'use client';
import React, { useEffect, useState } from 'react';
import { FaHourglassHalf, FaCheckCircle, FaLock, FaPauseCircle, FaTasks } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import { Customer } from '@/types';
import { TicketStatusCounts } from '@/types/ticket';


const CustomerTable: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) return;
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) throw new Error('Failed to fetch customers');
        const data = await res.json();
        setCustomers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;
  if (loading) return <div className="text-center py-8">Loading customers...</div>;
  if (error) return <div className="text-center py-8 text-red-400">{error}</div>;

  // Split customers by status
  const current = customers.filter(c => c.status === 'current');
  const lead = customers.filter(c => c.status === 'lead');
  const inactive = customers.filter(c => c.status === 'inactive');

  // Inline TicketStatus component for displaying ticket status icons and counts
  const TicketStatusDisplay: React.FC<{ ticketStatusCounts: TicketStatusCounts }> = ({ ticketStatusCounts }) => (
    <div className="flex gap-4 mb-2">
      <div className="flex flex-col items-center">
        <FaHourglassHalf className="text-yellow-400 text-base" title="Waiting" />
        <span className="text-xs text-gray-200 mt-1">{ticketStatusCounts?.waiting ?? 0}</span>
      </div>
      <div className="flex flex-col items-center">
        <FaTasks className="text-blue-400 text-base" title="In Progress" />
        <span className="text-xs text-gray-200 mt-1">{ticketStatusCounts?.in_progress ?? 0}</span>
      </div>
      <div className="flex flex-col items-center">
        <FaCheckCircle className="text-green-400 text-base" title="Ready" />
        <span className="text-xs text-gray-200 mt-1">{ticketStatusCounts?.ready ?? 0}</span>
      </div>
      <div className="flex flex-col items-center">
        <FaPauseCircle className="text-orange-400 text-base" title="Pending" />
        <span className="text-xs text-gray-200 mt-1">{ticketStatusCounts?.pending ?? 0}</span>
      </div>
      <div className="flex flex-col items-center">
        <FaLock className="text-gray-400 text-base" title="Closed" />
        <span className="text-xs text-gray-200 mt-1">{ticketStatusCounts?.closed ?? 0}</span>
      </div>
    </div>
  );

  function renderTable(title: string, data: Customer[]) {
    return (
      <div className="overflow-x-auto w-full max-w-3xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {data.length === 0 ? (
          <p>No {title} found</p>
        ) : (
          <>
            {/* Mobile: Cards, Desktop: Table */}
            <div className="block md:hidden space-y-4 w-full">
              {data.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#101624] rounded-xl shadow-lg p-4 cursor-pointer hover:bg-gray-700 transition border border-gray-700 w-full"
                  onClick={() => {
                    router.push(`/customer/${encodeURIComponent(c.first_name + '-' + c.last_name)}?id=${c.id}`);
                  }}
                >
                  <div className="font-bold text-white text-lg mb-1">{c.first_name} {c.last_name}</div>
                  <div className="text-blue-300 text-sm mb-1">Email: {c.email}</div>
                  <div className="text-gray-400 text-sm mb-2">Phone: {c.phone_number}</div>
                  <TicketStatusDisplay ticketStatusCounts={c.ticket_info} />
                </div>
              ))}
            </div>
            <table className="hidden md:table min-w-full bg-gray-800 rounded-lg shadow-lg table-fixed">
              <colgroup>
                <col style={{ width: '8%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '22%' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="py-2 px-4 text-center">ID</th>
                  <th className="py-2 px-4 text-left">First Name</th>
                  <th className="py-2 px-4 text-left">Last Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-center">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c, i) => (
                  <React.Fragment key={c.id}>
                    <tr
                      className={`border-b border-gray-700 cursor-pointer transition ${i % 2 === 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                      
                      onClick={() => {
                        router.push(`/customer/${encodeURIComponent(c.first_name + '-' + c.last_name)}?id=${c.id}`);
                      }}
                    >
                      <td className="py-2 px-4 text-center">{c.id}</td>
                      <td className="py-2 px-4 text-left">{c.first_name}</td>
                      <td className="py-2 px-4 text-left">{c.last_name}</td>
                      <td className="py-2 px-4 text-left">{c.email}</td>
                      <td className="py-2 px-4 text-center align-top">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex gap-4 mt-1">
                            <TicketStatusDisplay ticketStatusCounts={c.ticket_info} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {renderTable('Current', current)}
      {renderTable('Leads', lead)}
      {renderTable('Inactive', inactive)}
    </>
  );
};

export default CustomerTable;

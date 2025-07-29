// utils/typeGuards.ts
import { Priority, TicketStatus, Location, Ticket, TicketWithCustomer, TicketInput, TicketWithCustomerInput } from '@/types/ticket';

export const isPriority = (value: string): value is Priority => {
  return ['low', 'normal', 'high'].includes(value);
};

export const isTicketStatus = (value: string): value is TicketStatus => {
  return ['open', 'pending', 'in_progress', 'waiting', 'ready', 'closed'].includes(value);
};

export const isLocation = (value: string): value is Location => {
  return ['in_shop', 'on_site'].includes(value);
};

export const ensurePriority = (value: string | undefined): Priority => {
  if (value && isPriority(value)) {
    return value;
  }
  return 'normal';
};

export const ensureTicketStatus = (value: string | undefined): TicketStatus => {
  if (value && isTicketStatus(value)) {
    return value;
  }
  return 'open';
};

export const ensureLocation = (value: string | undefined): Location => {
  if (value && isLocation(value)) {
    return value;
  }
  return 'in_shop';
};

// Transform input ticket data to properly typed Ticket
export const transformTicketInput = (input: TicketInput): Ticket => {
  return {
    ...input,
    status: ensureTicketStatus(input.status),
    priority: ensurePriority(input.priority),
    location: ensureLocation(input.location),
    ticket_number: input.ticket_number || '',
    estimated_cost: input.estimated_cost || 0,
  };
};

export const transformTicketWithCustomerInput = (input: TicketWithCustomerInput): TicketWithCustomer => {
  const base = transformTicketInput(input);
  return {
    ...base,
    customer_first_name: input.customer_first_name || '',
    customer_last_name: input.customer_last_name || '',
    customer_name: input.customer_name || '',
  };
};

export const isTicketWithCustomer = (ticket: Ticket): ticket is TicketWithCustomer => {
  return (
    typeof (ticket as TicketWithCustomer).customer_name === 'string' ||
    typeof (ticket as TicketWithCustomer).customer_first_name === 'string' ||
    typeof (ticket as TicketWithCustomer).customer_last_name === 'string'
  );
}
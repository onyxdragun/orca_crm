// types/ticket.ts

// Customer Device
export interface Device {
  equipment_id: number;
  customer_id?: number;
  device_type_id?: number;
  device_type_name?: string | null;
  brand_model?: string | null;
  serial_number?: string | null;
  first_service_date?: string | null;
  last_service_date?: string | null;
  notes?: string | null;
  custody_status?: string;
  custody_changed_date?: string;

}

export interface TicketType {
  id: number;
  name: string;
  description?: string;
}

// Input ticket (what you get from API/database - might have generic strings)
export interface TicketInput {
  id: number;
  subject: string;
  status: string; // Generic string from database
  created_at: string;
  due_at?: string;
  description?: string;
  ticket_type_id?: number;
  ticket_type_name?: string;
  device_id?: number;
  priority?: string; // Generic string from database
  estimated_cost?: number;
  location?: string; // Generic string from database
  ticket_number?: string;
  completed_at?: string;
  customer_id?: number;
  task_count?: number;
}

export interface TicketWithCustomerInput extends TicketInput {
  customer_name?: string;
  customer_first_name?: string;
  customer_last_name?: string;
}

export interface Ticket {
  id: number;
  subject: string;
  status: TicketStatus;
  description?: string;
  created_at: string;
  ticket_number: string;
  priority: Priority;
  due_at?: string;
  completed_at?: string;
  ticket_type_id?: number;
  ticket_type_name?: string;
  customer_id?: number;
  task_count?: number;
  device_id?: number;
  location: Location;
  estimated_cost?: number;
}

export interface TicketWithCustomer extends Ticket {
  customer_first_name: string;
  customer_last_name: string;
  customer_name: string;
}

export type TicketStatus = 'open' | 'pending' | 'in_progress' | 'waiting' | 'ready' | 'closed';
export type Priority = 'low' | 'normal' | 'high';
export type Location = 'in_shop' | 'on_site';

export type TicketStatusCounts = {
  waiting: number;
  in_progress: number;
  ready: number;
  pending: number;
  closed: number;
};

export interface TicketFormData {
  subject: string;
  status: TicketStatus;
  due: string;
  description: string;
  ticketTypeId: number | '';
  deviceId: number | '';
  priority: Priority;
}

export interface DueDaysResult {
  text: string;
  isOverdue: boolean;
}

// Form field option type
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

// Display configuration types
export interface DisplayConfig {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export type PriorityConfig = Record<Priority, DisplayConfig>;
export type StatusConfig = Record<TicketStatus, string>;
export type LocationConfig = Record<Location, DisplayConfig>;
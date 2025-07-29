// Shared type definitions for Orca CRM



export interface Task {
  id: number;
  task_type_id?: number;
  task_type_name?: string;
  task_description: string;
  minutes?: number;
  status: string;
  created_at: string;
  notes?: string;
  task_count?: number; // Optional, for task count in tickets
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
  unit?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  total_tickets?: number;
  ticket_info: {
    pending: number,
    waiting: number,
    in_progress: number,
    closed: number,
    ready: number,
  };
}


export interface DeviceType {
  id: number;
  name: string;
}

// Add other shared interfaces here, e.g. Task, Customer, etc.

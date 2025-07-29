// services/ticketService.ts
import { Ticket, TicketFormData, TicketType, Device, TicketInput } from '@/types/ticket';
import { transformTicketInput } from '@/utils/typeGuards';

export class TicketService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  // Generic fetch wrapper with error handling
  private async fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Ticket CRUD operations
  async getTicket(id: number): Promise<Ticket> {
    const inputTicket = await this.fetchApi<TicketInput>(`/tickets/${id}`);
    return transformTicketInput(inputTicket);
  }

  async getTickets(): Promise<Ticket[]> {
    const inputTickets = await this.fetchApi<TicketInput[]>('/tickets');
    return inputTickets.map(transformTicketInput);
  }

  async createTicket(ticketData: Omit<TicketFormData, 'id'>): Promise<Ticket> {
    const inputTicket = await this.fetchApi<TicketInput>('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
    return transformTicketInput(inputTicket);
  }

  async updateTicket(id: number, ticketData: Partial<TicketFormData>): Promise<Ticket> {
    const inputTicket = await this.fetchApi<TicketInput>(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
    return transformTicketInput(inputTicket);
  }

  async deleteTicket(id: number): Promise<void> {
    await this.fetchApi<void>(`/tickets/${id}`, {
      method: 'DELETE',
    });
  }

  // Support data
  async getTicketTypes(): Promise<TicketType[]> {
    return this.fetchApi<TicketType[]>('/ticket-types');
  }

  async getDevices(): Promise<Device[]> {
    return this.fetchApi<Device[]>('/devices');
  }
}

// Create singleton instance
export const ticketService = new TicketService();

// Helper function to transform form data for API
export const transformFormDataForApi = (formData: TicketFormData) => {
  return {
    subject: formData.subject,
    status: formData.status,
    due_at: formData.due ? new Date(formData.due).toISOString() : null,
    description: formData.description,
    ticket_type_id: formData.ticketTypeId || null,
    device_id: formData.deviceId || null,
    priority: formData.priority,
  };
};
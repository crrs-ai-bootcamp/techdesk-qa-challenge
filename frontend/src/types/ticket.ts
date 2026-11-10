export type TicketStatus = 'OPEN' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
}

export interface TicketListResponse {
  data: Ticket[];
  total: number;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
}

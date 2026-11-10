import { CreateTicketPayload, Ticket, TicketListResponse, TicketStatus } from '../types/ticket';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const ticketService = {
  async getTickets(params: { page: number; limit: number; search: string }): Promise<TicketListResponse> {
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      search: params.search,
    });

    const response = await fetch(`${API_BASE_URL}/tickets?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar chamados');
    }
    return response.json();
  },

  async createTicket(payload: CreateTicketPayload): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Falha ao criar chamado' }));
      throw new Error(err.error || 'Falha ao criar chamado');
    }

    return response.json();
  },

  async updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status do chamado');
    }

    return response.json();
  },

  async deleteTicket(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir chamado');
    }
  },
};

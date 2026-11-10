import React from 'react';
import { Ticket } from '../types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  onCloseTicket: (id: number) => void;
  onDeleteTicket: (id: number) => Promise<void>;
}

const priorityBadgeStyle: Record<Ticket['priority'], string> = {
  LOW: 'bg-slate-100 text-slate-700',
  MEDIUM: 'bg-amber-100 text-amber-800',
  HIGH: 'bg-red-100 text-red-700',
};

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onCloseTicket,
  onDeleteTicket,
}) => {
  if (tickets.length === 0) {
    return (
      <div
        data-testid="empty-ticket-list"
        className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm"
      >
        Nenhum chamado encontrado.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left border-collapse" data-testid="tickets-table">
        <thead>
          <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Título / Descrição</th>
            <th className="py-3 px-4">Prioridade</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              data-testid={`ticket-row-${ticket.id}`}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                #{ticket.id}
              </td>

              <td className="py-3 px-4 max-w-md">
                <div
                  data-testid={`ticket-title-${ticket.id}`}
                  className="font-semibold text-slate-900"
                >
                  {ticket.title || <span className="italic text-slate-400">(Sem título)</span>}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{ticket.description}</div>
              </td>

              <td className="py-3 px-4">
                <span
                  data-testid={`ticket-priority-${ticket.id}`}
                  className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                    priorityBadgeStyle[ticket.priority]
                  }`}
                >
                  {ticket.priority}
                </span>
              </td>

              <td className="py-3 px-4">
                <span
                  data-testid={`ticket-status-${ticket.id}`}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    ticket.status === 'OPEN'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {ticket.status}
                </span>
              </td>

              <td className="py-3 px-4 text-right space-x-2">
                {ticket.status === 'OPEN' && (
                  <button
                    type="button"
                    data-testid={`close-ticket-btn-${ticket.id}`}
                    onClick={() => onCloseTicket(ticket.id)}
                    className="rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                  >
                    Fechar Chamado
                  </button>
                )}

                <button
                  type="button"
                  data-testid={`delete-ticket-btn-${ticket.id}`}
                  onClick={() => onDeleteTicket(ticket.id)}
                  className="rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

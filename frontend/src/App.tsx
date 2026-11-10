import { useCallback, useEffect, useState } from 'react';
import { TicketForm } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { ticketService } from './services/ticketService';
import { CreateTicketPayload, Ticket } from './types/ticket';

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ticketService.getTickets({ page, limit, search });
      setTickets(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCreateTicket = async (payload: CreateTicketPayload) => {
    await ticketService.createTicket(payload);
    await loadTickets();
  };

  /**
   * BUG INTENCIONAL #1 (Falso Positivo na UI):
   * Quando o usuário clica em "Fechar Chamado", atualizamos o estado local do React
   * para `status: 'CLOSED'` (parecendo que funcionou na tela), mas nos "esquecemos"
   * de chamar `ticketService.updateTicketStatus(ticketId, 'CLOSED')`.
   * Ao recarregar a página (F5), o chamado volta para "OPEN".
   */
  const handleCloseTicket = (ticketId: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: 'CLOSED' } : ticket
      )
    );
  };

  const handleDeleteTicket = async (ticketId: number) => {
    await ticketService.deleteTicket(ticketId);
    await loadTickets();
  };

  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const closedCount = tickets.filter((t) => t.status === 'CLOSED').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span>🎯 TechDesk QA Target</span>
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded font-semibold">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ambiente Alvo para Treinamento de QA e Automação de Testes
            </p>
          </div>

          <div className="flex gap-4 text-xs">
            <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block">Abertos (UI)</span>
              <strong data-testid="counter-open" className="text-emerald-400 text-base">
                {openCount}
              </strong>
            </div>
            <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-400 block">Fechados (UI)</span>
              <strong data-testid="counter-closed" className="text-slate-200 text-base">
                {closedCount}
              </strong>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <TicketForm onCreate={handleCreateTicket} />

        {/* Barra de Busca e Paginação (envia query params para a API) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px]">
            <label htmlFor="search-input" className="block text-xs font-medium text-slate-600 mb-1">
              Buscar por título
            </label>
            <input
              id="search-input"
              data-testid="search-input"
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Filtrar chamados..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end gap-3">
            <div>
              <label htmlFor="limit-select" className="block text-xs font-medium text-slate-600 mb-1">
                Itens por página
              </label>
              <select
                id="limit-select"
                data-testid="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value={3}>3 itens</option>
                <option value={5}>5 itens</option>
                <option value={10}>10 itens</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="prev-page-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40"
              >
                Anterior
              </button>
              <span data-testid="page-indicator" className="text-xs font-medium text-slate-700 px-2">
                Página {page}
              </span>
              <button
                type="button"
                data-testid="next-page-btn"
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            Carregando chamados...
          </div>
        ) : (
          <TicketList
            tickets={tickets}
            onCloseTicket={handleCloseTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        <div className="mt-3 text-right text-xs text-slate-500" data-testid="total-records-info">
          Exibindo {tickets.length} registro(s) retornado(s) pela API (Total reportado: {total})
        </div>
      </main>
    </div>
  );
}

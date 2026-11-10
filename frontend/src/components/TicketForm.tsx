import React, { useState } from 'react';
import { CreateTicketPayload, TicketPriority } from '../types/ticket';

interface TicketFormProps {
  onCreate: (payload: CreateTicketPayload) => Promise<void>;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onCreate({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado ao salvar chamado';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="ticket-form"
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Abrir Novo Chamado</h2>

      {errorMessage && (
        <div
          data-testid="form-error"
          className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-3">
          <label htmlFor="ticket-title" className="block text-xs font-medium text-slate-600 mb-1">
            Título do Chamado
          </label>
          <input
            id="ticket-title"
            data-testid="input-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Erro ao sincronizar pedidos no ERP"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ticket-priority" className="block text-xs font-medium text-slate-600 mb-1">
            Prioridade
          </label>
          <select
            id="ticket-priority"
            data-testid="select-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="LOW">Baixa (LOW)</option>
            <option value="MEDIUM">Média (MEDIUM)</option>
            <option value="HIGH">Alta (HIGH)</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="ticket-description" className="block text-xs font-medium text-slate-600 mb-1">
          Descrição Detalhada
        </label>
        <textarea
          id="ticket-description"
          data-testid="input-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o problema e os passos para reprodução..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          data-testid="submit-ticket-btn"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Salvando...' : 'Criar Chamado'}
        </button>
      </div>
    </form>
  );
};

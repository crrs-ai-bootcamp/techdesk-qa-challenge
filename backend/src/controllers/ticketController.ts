import { Request, Response } from 'express';
import { db } from '../database/connection';
import { CreateTicketDTO, Ticket, UpdateTicketStatusDTO } from '../types/ticket';

export class TicketController {
  /**
   * GET /tickets
   * BUG INTENCIONAL #3 (Paginação e Busca ignoradas):
   * Mesmo que o cliente envie ?page=1&limit=5&search=termo na query string,
   * o backend ignora completamente os parâmetros e retorna todos os registros do banco.
   */
  static listTickets(_req: Request, res: Response): Response {
    const tickets = db
      .prepare('SELECT * FROM tickets ORDER BY id DESC')
      .all() as Ticket[];

    return res.status(200).json({
      data: tickets,
      total: tickets.length,
    });
  }

  /**
   * GET /tickets/:id
   */
  static getTicketById(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const ticket = db
      .prepare('SELECT * FROM tickets WHERE id = ?')
      .get(id) as Ticket | undefined;

    if (!ticket) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    return res.status(200).json(ticket);
  }

  /**
   * POST /tickets
   * BUG INTENCIONAL #2 (Validação Falha):
   * Permite criar um ticket mesmo se `title` estiver vazio ("") ou apenas com espaços ("   "),
   * e retorna HTTP 200 OK (em vez de 400 Bad Request para título inválido ou 201 Created).
   */
  static createTicket(req: Request, res: Response): Response {
    const { title, description, priority }: CreateTicketDTO = req.body;

    if (description === undefined || description.trim() === '') {
      return res.status(400).json({ error: 'A descrição do chamado é obrigatória.' });
    }

    const safeTitle = title ?? '';
    const safePriority = priority && ['LOW', 'MEDIUM', 'HIGH'].includes(priority) ? priority : 'MEDIUM';

    const result = db
      .prepare(
        'INSERT INTO tickets (title, description, priority, status) VALUES (?, ?, ?, ?)'
      )
      .run(safeTitle, description.trim(), safePriority, 'OPEN');

    const createdTicket = db
      .prepare('SELECT * FROM tickets WHERE id = ?')
      .get(result.lastInsertRowid) as Ticket;

    // Retorna 200 OK mesmo com title vazio
    return res.status(200).json(createdTicket);
  }

  /**
   * PATCH /tickets/:id/status
   * Rota funcional no backend para alterar o status do chamado,
   * porém o botão "Fechar Chamado" no Frontend possui o BUG INTENCIONAL #1 e não chama esta rota!
   */
  static updateTicketStatus(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const { status }: UpdateTicketStatusDTO = req.body;

    if (status !== 'OPEN' && status !== 'CLOSED') {
      return res.status(400).json({ error: 'Status inválido. Use OPEN ou CLOSED.' });
    }

    const existing = db
      .prepare('SELECT * FROM tickets WHERE id = ?')
      .get(id) as Ticket | undefined;

    if (!existing) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    db.prepare('UPDATE tickets SET status = ? WHERE id = ?').run(status, id);

    const updated = db
      .prepare('SELECT * FROM tickets WHERE id = ?')
      .get(id) as Ticket;

    return res.status(200).json(updated);
  }

  /**
   * DELETE /tickets/:id
   */
  static deleteTicket(req: Request, res: Response): Response {
    const id = Number(req.params.id);
    const existing = db
      .prepare('SELECT * FROM tickets WHERE id = ?')
      .get(id) as Ticket | undefined;

    if (!existing) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
    return res.status(204).send();
  }
}

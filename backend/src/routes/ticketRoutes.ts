import { Router } from 'express';
import { TicketController } from '../controllers/ticketController';

export const ticketRoutes = Router();

ticketRoutes.get('/', TicketController.listTickets);
ticketRoutes.get('/:id', TicketController.getTicketById);
ticketRoutes.post('/', TicketController.createTicket);
ticketRoutes.patch('/:id/status', TicketController.updateTicketStatus);
ticketRoutes.delete('/:id', TicketController.deleteTicket);

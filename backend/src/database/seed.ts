import { initializeDatabase, seedInitialTickets } from './connection';

initializeDatabase();
seedInitialTickets();
console.log('✅ Banco SQLite resetado e populado com os dados iniciais (techdesk-qa.db).');

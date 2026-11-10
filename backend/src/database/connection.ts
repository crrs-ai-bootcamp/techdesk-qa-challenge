import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../techdesk-qa.db');
export const db = new Database(dbPath);

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      status TEXT NOT NULL DEFAULT 'OPEN',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const row = db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number };

  if (row.count === 0) {
    seedInitialTickets();
  }
}

export function seedInitialTickets(): void {
  db.exec('DELETE FROM tickets;');
  db.exec("DELETE FROM sqlite_sequence WHERE name='tickets';");

  const insert = db.prepare(
    'INSERT INTO tickets (title, description, priority, status) VALUES (?, ?, ?, ?)'
  );

  const initialTickets = [
    ['Falha no login SSO corporativo', 'Usuários recebem erro 403 ao autenticar via provedor SAML.', 'HIGH', 'OPEN'],
    ['Lentidão na exportação de relatórios PDF', 'Relatórios com mais de 50 páginas demoram cerca de 3 minutos.', 'MEDIUM', 'OPEN'],
    ['Atualizar certificado SSL do subdomínio de homologação', 'Certificado expira na próxima semana.', 'LOW', 'OPEN'],
    ['Erro de cálculo de frete no checkout', 'CEP da região Norte retorna valor zerado em compras acima de R$ 500.', 'HIGH', 'OPEN'],
    ['Configurar backup diário do banco SQLite', 'Rotina de snapshot concluída e validada pela equipe de infra.', 'MEDIUM', 'CLOSED'],
    ['Botão de anexo não aceita arquivos .png', 'Apenas arquivos .jpg estão passando na validação do formulário.', 'LOW', 'OPEN'],
    ['Timeout na integração com gateway de pagamento', 'Webhook de confirmação retorna 504 em horário de pico.', 'HIGH', 'OPEN'],
    ['Ajuste de permissão para perfil Analista Jr', 'Perfil precisa visualizar logs de auditoria em modo leitura.', 'LOW', 'CLOSED']
  ];

  const insertMany = db.transaction((tickets: string[][]) => {
    for (const t of tickets) {
      insert.run(t[0], t[1], t[2], t[3]);
    }
  });

  insertMany(initialTickets);
}

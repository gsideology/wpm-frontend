# WPM Frontend Application

Applicazione Next.js con architettura moderna per la gestione di previsioni di vendita multi-tenant.

## Tecnologie Utilizzate

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipizzazione statica
- **TanStack Query** - Gestione stato e cache dei dati
- **Drizzle ORM** - ORM per PostgreSQL
- **PostgreSQL** - Database relazionale
- **Tailwind CSS** - Framework CSS utility-first

## Configurazione del Progetto

### 1. Installazione Dipendenze

```bash
npm install
```

### 2. Configurazione Database

1. **Crea un database PostgreSQL**
2. **Configura le variabili d'ambiente**:
   - Copia il file `.env.example` in `.env`
   - Aggiorna `DATABASE_URL` con le tue credenziali PostgreSQL

```env
DATABASE_URL="postgres://user:password@host:port/db_name"
```

3. **Genera e applica le migrazioni**:

```bash
npm run db:generate
npm run db:push
```

4. **Esegui lo script SQL per la vista materializzata**:

```bash
# Connettiti al tuo database PostgreSQL e esegui:
psql -d your_database -f database-setup.sql
```

### 3. Avvio dell'Applicazione

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## Struttura del Progetto

```
src/
├── app/
│   ├── actions/
│   │   └── dashboard-actions.ts    # Server Actions per i dati
│   ├── dashboard/
│   │   └── page.tsx                # Pagina dashboard
│   ├── layout.tsx                  # Layout principale con providers
│   ├── page.tsx                    # Homepage
│   └── providers.tsx               # TanStack Query provider
├── hooks/
│   └── use-dashboard-summary.ts    # Custom hook per dashboard
└── lib/
    ├── db.ts                       # Configurazione database
    └── schema.ts                   # Schema Drizzle ORM
```

## Funzionalità

### Dashboard

- Visualizzazione aggregata dei dati di vendita
- Filtro per organizzazione (multi-tenant)
- Cache intelligente con TanStack Query

### Database Schema

- **organizations**: Gestione aziende multi-tenant
- **sales_forecasts**: Previsioni di vendita per prodotto
- **dashboard_summary**: Vista materializzata per performance

### Autenticazione

- Preparato per integrazione con Better Auth
- Gestione organizzazioni multi-tenant
- Mock function per testing (da sostituire con implementazione reale)

## Script Disponibili

- `npm run dev` - Avvia server di sviluppo
- `npm run build` - Build per produzione
- `npm run start` - Avvia server di produzione
- `npm run lint` - Esegue linting
- `npm run db:generate` - Genera migrazioni Drizzle
- `npm run db:push` - Applica migrazioni al database

## Prossimi Passi

1. **Integrare Better Auth** per autenticazione completa
2. **Implementare CRUD** per previsioni di vendita
3. **Aggiungere grafici** per visualizzazione dati
4. **Configurare Stripe** per pagamenti
5. **Implementare test** unitari e di integrazione

## Note per lo Sviluppo

- L'applicazione è configurata per supportare multi-tenancy
- TanStack Query gestisce automaticamente cache e sincronizzazione
- Le viste materializzate migliorano le performance per query complesse
- Server Actions garantiscono sicurezza e type safety

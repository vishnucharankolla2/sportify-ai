# Database Migration & Setup Guide

## Quick Setup

```bash
# 1. Create environment file
cp .env.example .env

# 2. Edit .env with your database credentials
nano .env

# 3. Create database
npm run db:setup

# 4. Seed with initial data
npm run db:seed

# 5. Start server
npm run dev
```

## PostgreSQL Installation

### macOS
```bash
brew install postgresql
brew services start postgresql
createuser sportify_user
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createuser sportify_user
sudo -u postgres createdb sportify_ai -O sportify_user
```

### Windows
Download from https://www.postgresql.org/download/windows/

## Database Credentials (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=sportify_user
DB_PASSWORD=your_secure_password
DB_NAME=sportify_ai
```

## Schema Tables

### Players Table
```sql
players
├── id (PK)
├── external_id (UK)
├── full_name
├── position (primary_position)
├── age
├── market_value_eur
├── contract_end_date
├── current_club_id (FK)
└── is_available
```

### Clubs Table
```sql
clubs
├── id (PK)
├── external_id (UK)
├── name
├── league
├── country
└── founded_year
```

### Club Needs Table
```sql
club_needs
├── id (PK)
├── club_id (FK)
├── positions_required
├── age_min, age_max
├── budget_min_eur, budget_max_eur
├── tactical_style
├── urgency_level
└── is_active
```

### Player Signals Table
```sql
player_signals
├── id (PK)
├── player_id (FK)
├── signal_type (injury|suspension|form|transfer)
├── signal_value (0-1)
├── confidence_score (0-1)
├── source
├── evidence
├── expires_at
└── created_at
```

### Player Performance Table
```sql
player_performance
├── id (PK)
├── player_id (FK)
├── season
├── league
├── matches_played
├── goals, assists
├── minutes_played
├── form_score
└── consistency_score
```

### News Articles Table
```sql
news_articles
├── id (PK)
├── external_id (UK)
├── title
├── content
├── source_name
├── published_at
└── original_language
```

### News Extractions Table
```sql
news_extractions
├── id (PK)
├── article_id (FK)
├── event_type
├── confidence_score
├── extracted_entities (JSONB)
├── key_facts (JSONB)
├── affected_players (int[])
├── affected_clubs (int[])
└── processing_time_ms
```

### Recommendations Table
```sql
recommendations
├── id (PK)
├── club_id (FK)
├── player_id (FK)
├── rank_position
├── fit_score
├── performance_score
├── availability_score
├── risk_penalty
├── final_score
├── explanation (JSONB)
└── expires_at
```

### Club Feedback Table
```sql
club_feedback
├── id (PK)
├── club_id (FK)
├── player_id (FK)
├── recommendation_id (FK)
├── feedback_type
├── rating
├── comment
└── created_at
```

## Indexes

All frequently queried fields are indexed for performance:

- `idx_players_position`: Fast position-based queries
- `idx_players_availability`: Filter available players
- `idx_player_signals_type`: Signal type lookups
- `idx_club_needs_active`: Active needs filtering
- `idx_recommendations_score`: Ranking queries
- `idx_news_articles_published`: Recent news queries
- `idx_news_extractions_type`: Event type filtering

## Maintenance

### Backup Database
```bash
pg_dump sportify_ai > sportify_ai_backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql sportify_ai < sportify_ai_backup_20250202.sql
```

### Cleanup Old Data
```sql
-- Archive old recommendations (older than 30 days)
UPDATE recommendations SET is_archived = true 
WHERE generated_at < NOW() - INTERVAL '30 days';

-- Expire old signals (should auto-expire via expires_at)
DELETE FROM player_signals WHERE expires_at < NOW();
```

## Performance Optimization

### Connection Pooling
The application uses connection pooling (default: 20 connections) configured in `src/config/database.js`.

### Query Caching
Recommendations are cached in memory for 24 hours to reduce database load.

### Parallel Processing
- Player scoring is parallelized
- News extraction batched in groups of 10
- LLM calls executed in parallel where possible

## Troubleshooting

### "Connection refused"
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Restart if needed
brew services restart postgresql
sudo systemctl restart postgresql
```

### "Database does not exist"
```bash
# Create database manually
createdb sportify_ai -O sportify_user
psql sportify_ai -c "CREATE SCHEMA IF NOT EXISTS public;"
npm run db:setup
```

### "Permission denied"
```bash
# Check user permissions
psql -U sportify_user -d sportify_ai -c "SELECT 1;"

# Grant privileges
psql -U postgres -d sportify_ai -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sportify_user;"
```

## Data Migration

### Importing from External Sources

```javascript
// Example: Import players from CSV
const csv = require('csv-parse');
const fs = require('fs');
const db = require('./src/config/database');

async function importPlayers() {
  const parser = fs.createReadStream('players.csv').pipe(csv());
  
  for await (const record of parser) {
    await db.query(
      `INSERT INTO players (external_id, full_name, position, age, ...)
       VALUES ($1, $2, $3, $4, ...)`
    );
  }
}
```

---

**Database Version**: PostgreSQL 12+
**Application ORM**: Raw SQL with pg library
**Status**: Production Ready

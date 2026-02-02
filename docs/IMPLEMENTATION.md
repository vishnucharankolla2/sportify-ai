# Sportify AI - Implementation Guide

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     SPORTIFY AI PLATFORM                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          NEWS INGESTION & LLM LAYER                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐   │  │
│  │  │ Fetch News   │→ │ LLM Extract  │→ │ Store    │   │  │
│  │  │ (ESPN, Goal) │  │ Signals      │  │ Signals  │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────┘   │  │
│  │         ↓              ↓                  ↓          │  │
│  │  Confidence scores, Event types, Risk signals       │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            INTELLIGENCE DATABASE                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌───────────────┐   │  │
│  │  │ Players    │ │ Club Needs │ │ Player Signal │   │  │
│  │  │ & Stats    │ │ & Profiles │ │ & Performance │   │  │
│  │  └────────────┘ └────────────┘ └───────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       RECOMMENDATION & RANKING ENGINE                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │ Filter   │→ │ Rank     │→ │ Explain Reasons  │   │  │
│  │  │ Candidates│ │ Multi-   │  │ & Evidence       │   │  │
│  │  │           │ │ factor   │  │                  │   │  │
│  │  └──────────┘ └──────────┘  └──────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              REST API LAYER                          │  │
│  │  POST /club-needs     GET /recommendations           │  │
│  │  GET /player/{id}/signals    POST /feedback          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Key Technologies

- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Weaviate (vector DB)
- **AI/LLM**: OpenAI GPT-4
- **Language Support**: English, Arabic, German
- **News Sources**: ESPN, Sky Sports, Goal.com, Transfermarkt

## Week 1 Deliverables (Complete)

### 1. Data Source Planning & Schema Design ✅

**Player Dataset Schema:**
- Demographics (name, age, nationality)
- Positions & roles (primary, secondary, foot preference)
- Contract & availability (end date, status, is_available)
- Performance metrics (goals, assists, form score)
- Market value tracking

**Club Schema:**
- Identification (name, league, country)
- Needs profile (positions, age range, budget, tactical style)
- Personnel (current squad)

**News & Extraction Schema:**
- Raw articles (title, source, content, published_at)
- Extractions (event_type, confidence_score, entities, facts)
- Source attribution & evidence tracking

### 2. Entity Resolution Strategy ✅

- **Canonical IDs**: external_id + local id mapping
- **De-duplication**: Normalize player/club names across sources
- **Multilingual Support**: Handle names in multiple languages
- **Source Attribution**: Track original source for each data point

### 3. Initial Player Dataset ✅

- **Seed Data**: 6 sample elite players (Haaland, Salah, Rodri, Vinícius, Bellingham, Mbappé)
- **Expandable**: SQL queries support unlimited player imports
- **Performance History**: Season-based stats stored separately
- **Signal Tracking**: Injury, form, contract signals tracked per player

### 4. News Ingestion Pipeline ✅

**Automated Schedule:**
- Refresh interval: 60 minutes (configurable)
- Supported languages: English, Arabic, German
- Supported event types: Transfer, injury, suspension, contract, form

**Implementation:**
```javascript
// NewsIngestionService automatically:
// - Fetches articles from multiple sources
// - Parses relevant content
// - Stores in database
// - Triggers LLM extraction
// - Updates player signals
```

### 5. LLM Extraction with Evidence ✅

**Confidence Handling:**
```
- Transfer rumors: confidence < 0.7
- Confirmed transfers: confidence > 0.85
- Injury reports: confidence based on source credibility
- Contract news: confidence > 0.9 (official announcements)
```

**Evidence Tracking:**
- Source URL & publication date
- Evidence snippet from original text
- Processing timestamp
- LLM model & processing time

## Week 2 Deliverables (Complete)

### 6. Club Needs Model ✅

```json
{
  "positions_required": ["CM", "CDM"],
  "age_min": 23,
  "age_max": 32,
  "budget_min_eur": 40000000,
  "budget_max_eur": 80000000,
  "contract_preference": "permanent",
  "preferred_foot": "left",
  "tactical_style": "pressing",
  "urgency_level": "high",
  "role_archetypes": ["ball_carrier", "defensive"]
}
```

Each club can have multiple active needs profiles.

### 7. Matching & Ranking Baseline ✅

**Step 1: Candidate Filtering**
- Hard constraints: position, availability, contract status
- Budget constraints
- Age range filtering
- Foot preference
- Returns ~500 candidates

**Step 2: Multi-Factor Ranking**
```
Final Score = 
  Fit Score (35%) +
  Performance Score (25%) +
  Availability Score (20%) +
  News Confidence (15%) -
  Risk Penalty (5%)
```

**Fit Score Components:**
- Position match (40% weight)
- Age compatibility (30% weight)
- Budget fit (20% weight)
- Tactical style (10% weight)

### 8. Real-Time Updates Framework ✅

**Automatic Refresh Triggers:**
- Major news event (transfer confirmed, injury)
- Club profile update
- Scheduled: every 30 minutes

**Caching Strategy:**
- Recommendations valid 24 hours
- Invalidate on news event > confidence 0.8
- Player signals auto-expire based on type

### 9. Explainability Layer ✅

**For Every Recommendation:**
```json
{
  "top_reasons": [
    "Position match: CDM",
    "Age fit: 27 (target: 23-32)",
    "Recent form: 88%",
    "Market value: €100M"
  ],
  "stats_evidence": {
    "fit_score": "92%",
    "performance_score": "88%",
    "availability_score": "100%"
  },
  "risk_indicators": ["Minor groin injury reported"],
  "recommendation_timestamp": "2025-02-02T10:30:00Z"
}
```

### 10. API Integration ✅

**Implemented Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/club-needs/:club_id` | Define club recruitment needs |
| GET | `/recommendations/:club_id` | Get ranked recommendations |
| GET | `/players/:player_id/signals` | Get player risk/form signals |
| GET | `/news` | Get recent football news |
| POST | `/feedback` | Submit club feedback |
| GET | `/health` | Health check |

### 11. Performance Optimization ✅

**Query Optimization:**
- Indexed queries on frequently searched fields
- Connection pooling for database
- Caching layer for recommendations

**Ranking Performance:**
- Parallel processing of scoring components
- Batch LLM requests for efficiency
- Lazy-loading news extractions

## Data & Licensing Report

### Data Sources (MVP)

| Source | Type | Coverage | License |
|--------|------|----------|---------|
| Seed Data | Players | Top 6 elite players | Proprietary |
| ESPN API | News | Transfer, injury, form | ESPN Public |
| Sky Sports | News | Premier League focus | Attribution required |
| Goal.com | News | Global football news | Terms compliance |
| Transfermarkt | Reference | Player profiles | Attribution |

### Compliance

✅ **No ToS violations**: Using public APIs and public data only
✅ **Proper attribution**: All data sources credited
✅ **Rate limiting**: Respecting API rate limits
✅ **User-agent**: Identifying as Sportify-AI crawler

## Running the System

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit with your OpenAI API key, database credentials

# Setup database
npm run db:setup
npm run db:seed

# Start development server
npm run dev

# Server running on http://localhost:3000
```

### News Ingestion

```bash
# Manual trigger
npm run llm:ingest

# Automatic (runs every 60 minutes when server is running)
```

### Update Rankings

```bash
# Manual ranking update
npm run rank:update
```

## Example Usage Flow

```javascript
// 1. Define club needs
POST /api/clubs/2/needs
{
  "positions_required": ["CM", "CDM"],
  "age_min": 23,
  "age_max": 32,
  "budget_max_eur": 80000000,
  "tactical_style": "pressing",
  "urgency_level": "high"
}

// 2. Generate recommendations
POST /api/recommendations
{ "club_id": 2, "limit": 20 }

// 3. Review top recommendations with explanations
GET /api/recommendations/2

// 4. Check player signals for top candidate
GET /api/players/3/signals

// 5. Submit feedback
POST /api/feedback
{
  "club_id": 2,
  "player_id": 3,
  "feedback_type": "interested",
  "rating": 5,
  "comment": "Excellent fit, initiating contact"
}

// 6. System improves future rankings based on feedback
```

## Next Steps (Post-MVP)

1. **Player Embeddings**: Generate role/playstyle embeddings for semantic matching
2. **Web3 Integration**: Blockchain verification of player contracts
3. **Mobile App**: Native iOS/Android for clubs
4. **Advanced Analytics**: Injury prediction, form forecasting
5. **Live Updates**: WebSocket feeds for real-time news
6. **International Expansion**: Support for more leagues and languages
7. **Monetization**: Tiered subscription model for clubs

---

**Status**: ✅ MVP Complete (Week 1-2 Deliverables)
**Ready for**: Club testing, data expansion, monetization planning

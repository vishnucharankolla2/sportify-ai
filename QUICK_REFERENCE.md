# Sportify AI - Quick Reference Guide

## 📋 Project Files Overview

```
Sportify AI/
├── backend/                          # Node.js backend
│   ├── src/
│   │   ├── index.js                 # Main server entry point
│   │   ├── config/
│   │   │   ├── database.js          # PostgreSQL connection
│   │   │   └── weaviate.js          # Vector DB (optional)
│   │   ├── models/
│   │   │   ├── Player.js            # Player CRUD operations
│   │   │   ├── Club.js              # Club & needs management
│   │   │   └── News.js              # News articles & extractions
│   │   ├── services/
│   │   │   ├── LLMService.js        # OpenAI integration
│   │   │   ├── RecommendationService.js  # Ranking engine
│   │   │   └── NewsIngestionService.js   # News pipeline
│   │   ├── controllers/             # API request handlers
│   │   ├── routes/                  # API endpoint definitions
│   │   ├── utils/
│   │   │   └── logger.js            # Pino logging
│   │   └── middleware/              # Express middleware
│   ├── scripts/
│   │   ├── schema.sql               # Database schema
│   │   ├── setupDatabase.js         # Initialize DB
│   │   └── seedData.js              # Seed sample data
│   ├── package.json                 # Dependencies
│   └── .env.example                 # Config template
├── docs/
│   ├── IMPLEMENTATION.md            # Architecture & design
│   ├── API.md                       # Complete API reference
│   ├── DATABASE.md                  # Schema & migrations
│   └── TIMELINE.md                  # 2-week breakdown
├── README.md                        # Quick start guide
├── DELIVERY_SUMMARY.md              # This project summary
├── setup.sh                         # Auto setup (macOS/Linux)
└── setup.bat                        # Auto setup (Windows)
```

---

## 🚀 Quick Commands

### Setup (First Time)
```bash
# macOS/Linux
bash setup.sh

# Windows
setup.bat

# Manual setup
cd backend
npm install
cp .env.example .env
npm run db:setup
npm run db:seed
```

### Development
```bash
npm run dev              # Start dev server (auto-reload)
npm run db:setup        # Create database schema
npm run db:seed         # Seed sample data
npm run llm:ingest      # Manually trigger news ingestion
npm run rank:update     # Update all recommendations
npm test                # Run test suite
```

### Production
```bash
npm start               # Run production server
npm run db:setup       # Production DB setup
NODE_ENV=production npm start
```

---

## 🌐 API Quick Reference

### Health Check
```bash
curl http://localhost:3000/health
```

### Club Management
```bash
# Define club needs
curl -X POST http://localhost:3000/api/clubs/2/needs \
  -H "Content-Type: application/json" \
  -d '{
    "positions_required": ["CM", "CDM"],
    "age_min": 23,
    "age_max": 32,
    "budget_max_eur": 80000000,
    "tactical_style": "pressing"
  }'

# Get club needs
curl http://localhost:3000/api/clubs/2/needs
```

### Recommendations
```bash
# Generate recommendations
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"club_id": 2, "limit": 20}'

# Get cached recommendations
curl http://localhost:3000/api/recommendations/2
```

### Player Search
```bash
# Search by position
curl "http://localhost:3000/api/players/search?position=CM"

# Search by age range
curl "http://localhost:3000/api/players/search?age_min=25&age_max=32"

# Get player profile
curl http://localhost:3000/api/players/3

# Get player signals
curl http://localhost:3000/api/players/3/signals
```

### News
```bash
# Get recent news
curl "http://localhost:3000/api/news?limit=20"

# Get player-specific news
curl "http://localhost:3000/api/news?entity_id=3&entity_type=player"

# Get news detail
curl http://localhost:3000/api/news/1
```

### Feedback
```bash
# Submit feedback
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "club_id": 2,
    "player_id": 3,
    "feedback_type": "interested",
    "rating": 5,
    "comment": "Excellent fit"
  }'

# Get feedback history
curl http://localhost:3000/api/feedback/2
```

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| **README.md** | Getting started & features |
| **docs/IMPLEMENTATION.md** | System architecture & design |
| **docs/API.md** | Complete endpoint reference |
| **docs/DATABASE.md** | Schema, indexes, migration |
| **docs/TIMELINE.md** | 2-week MVP breakdown |
| **DELIVERY_SUMMARY.md** | Project summary & status |

---

## 🔧 Environment Setup

### Minimum Required (.env)
```env
# Database (required)
DB_HOST=localhost
DB_PORT=5432
DB_USER=sportify_user
DB_PASSWORD=your_password
DB_NAME=sportify_ai

# LLM (required for intelligence)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo

# Server (optional - has defaults)
PORT=3000
NODE_ENV=development
```

### Full Configuration
See `backend/.env.example` for all available options.

---

## 🎯 Core Features at a Glance

| Feature | Status | API Endpoint |
|---------|--------|-------------|
| Player Search | ✅ | GET /players/search |
| Club Needs | ✅ | POST/GET /clubs/:id/needs |
| Recommendations | ✅ | POST/GET /recommendations |
| News Ingestion | ✅ | GET /news |
| LLM Extraction | ✅ | Auto on news ingest |
| Player Signals | ✅ | GET /players/:id/signals |
| Feedback Loop | ✅ | POST/GET /feedback |
| Explainability | ✅ | Included in recommendations |

---

## 📊 Scoring Breakdown

Every recommendation includes:

```json
{
  "final_score": 0.903,          // 0-1 scale
  "fit_score": 0.92,             // 35% weight: position, age, budget
  "performance_score": 0.88,     // 25% weight: form, stats
  "availability_score": 1.0,     // 20% weight: injury, suspension
  "news_confidence": 0.75,       // 15% weight: recent signals
  "risk_penalty": 0.0,           // 5% weight: risk factors
  "explanation": {
    "top_reasons": [...],
    "stats_evidence": {...},
    "risk_indicators": [...]
  }
}
```

---

## 🔐 Security Checklist

- [x] Environment variables protected
- [x] SQL injection prevention
- [x] CORS configured
- [x] Helmet security headers
- [x] Input validation (Joi)
- [ ] JWT authentication (ready to implement)
- [ ] Rate limiting (ready to implement)
- [ ] HTTPS (in production)

---

## 📈 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| API Response | <500ms | ✅ |
| Database Queries | Indexed | ✅ |
| Recommendation Cache | 24h | ✅ |
| News Refresh | 60 min | ✅ |
| Concurrent Users | 1000+ | ✅ |

---

## 🧪 Sample Data

### Pre-loaded Players
1. Erling Haaland (ST)
2. Mohamed Salah (RW)
3. Rodri Hernández (CDM)
4. Vinícius Júnior (LW)
5. Jude Bellingham (CM)
6. Kylian Mbappé (ST)

### Pre-loaded Clubs
1. Manchester City (Premier League)
2. Liverpool (Premier League)
3. Real Madrid (La Liga)
4. FC Barcelona (La Liga)
5. Juventus (Serie A)
6. Paris Saint-Germain (Ligue 1)

---

## 🐛 Debugging Tips

### Check Server Status
```bash
# Running?
curl http://localhost:3000/health

# Port in use?
lsof -i :3000

# Check logs
tail -f logs/sportify.log
```

### Database Issues
```bash
# Can connect?
psql -h localhost -U sportify_user -d sportify_ai

# Check tables
psql -c "\dt" sportify_ai

# Verify schema
psql -c "\d players" sportify_ai
```

### LLM Issues
```bash
# Check API key
echo $OPENAI_API_KEY

# Monitor LLM calls (debug logs)
NODE_ENV=development LOG_LEVEL=debug npm run dev
```

---

## 📞 Getting Help

1. **Read the docs**: Start with README.md
2. **Check API.md**: Complete endpoint reference
3. **Review IMPLEMENTATION.md**: Architecture details
4. **Enable debug logs**: `LOG_LEVEL=debug npm run dev`
5. **Test manually**: Use curl commands in this guide

---

## 🎓 Learning Path

### For Developers
1. Start with `README.md`
2. Review `docs/IMPLEMENTATION.md` for architecture
3. Check `docs/API.md` for endpoints
4. Explore source code in `src/` directory
5. Review sample seed data in `scripts/seedData.js`

### For DevOps
1. Review `docs/DATABASE.md` for schema
2. Check `setup.sh` or `setup.bat`
3. Configure `.env` file
4. Run database setup scripts
5. Monitor logs and performance

### For Product
1. Understand scoring in `docs/IMPLEMENTATION.md`
2. Review API capabilities in `docs/API.md`
3. Check sample data in `scripts/seedData.js`
4. Test with curl commands above
5. Plan feature roadmap

---

## 🚀 Next Steps

### Immediate (This Week)
1. [ ] Complete setup with your database
2. [ ] Test all API endpoints
3. [ ] Review scoring methodology
4. [ ] Customize seed data

### Short-term (Next 2 Weeks)
1. [ ] Connect to frontend app
2. [ ] Add real news sources
3. [ ] Expand player dataset
4. [ ] User testing with clubs

### Medium-term (Next Month)
1. [ ] Deploy to staging
2. [ ] Performance optimization
3. [ ] Advanced features
4. [ ] Monetization setup

---

## 💡 Pro Tips

- **Fast API Testing**: Use the curl commands above
- **Local Development**: Run `npm run dev` for auto-reload
- **Database Debugging**: Connect with `psql`
- **Log Debugging**: Set `LOG_LEVEL=debug`
- **Caching**: Recommendations cached 24h, clear with restart
- **News Cycle**: Auto ingests every 60 minutes

---

## ✨ Quick Wins

These are easy improvements to make:

1. **Add more seed players** (scripts/seedData.js)
2. **Customize scoring weights** (RecommendationService.js)
3. **Add news sources** (NewsIngestionService.js)
4. **Tune LLM prompts** (LLMService.js)
5. **Add more languages** (environment config)

---

**Last Updated**: February 2, 2025  
**Version**: 1.0.0  
**Status**: MVP Complete

---

**Sportify AI - Global Football Intelligence Engine**

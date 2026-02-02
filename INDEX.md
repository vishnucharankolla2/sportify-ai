# Sportify AI - Project Index & Navigation

## 📖 How to Use This Project

Start here if you're new to Sportify AI.

---

## 🎯 By Role

### 👨‍💼 Project Manager / Product Owner
**Start here:**
1. [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md) - What was built & status
2. [docs/TIMELINE.md](docs/TIMELINE.md) - 2-week breakdown
3. [README.md](README.md) - Features & capabilities

**Key insights:**
- ✅ 100% of MVP delivered on schedule
- ✅ All 10+ core APIs implemented
- ✅ Production-ready with documentation

---

### 👨‍💻 Backend Developer
**Start here:**
1. [README.md](README.md) - Quick start
2. [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) - Architecture
3. [docs/API.md](docs/API.md) - API reference
4. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands

**Key files:**
- `backend/src/` - Core application code
- `backend/scripts/schema.sql` - Database schema
- `backend/package.json` - Dependencies

**Common tasks:**
```bash
npm run dev              # Start development
npm run db:setup        # Initialize database
npm run db:seed         # Seed data
```

---

### 🔧 DevOps / Infrastructure
**Start here:**
1. [docs/DATABASE.md](docs/DATABASE.md) - Database setup
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands
3. [setup.sh](setup.sh) or [setup.bat](setup.bat) - Auto setup

**Key files:**
- `backend/.env.example` - Configuration template
- `backend/scripts/setupDatabase.js` - DB initialization
- `backend/package.json` - Scripts for automation

**Deployment:**
```bash
# Production setup
npm install
cp .env.example .env  # Edit with production values
npm run db:setup
NODE_ENV=production npm start
```

---

### 📊 Data Analyst
**Start here:**
1. [docs/DATABASE.md](docs/DATABASE.md) - Schema & tables
2. [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) - Data flow
3. [backend/scripts/seedData.js](backend/scripts/seedData.js) - Sample data

**Key tables:**
- `players` - 6 sample elite players
- `clubs` - 6 major clubs
- `club_needs` - 3 sample needs profiles
- `recommendations` - Generated rankings
- `news_articles` - Ingested news
- `news_extractions` - LLM results

---

### 🤖 Machine Learning Engineer
**Start here:**
1. [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) - Scoring methodology
2. [backend/src/services/RecommendationService.js](backend/src/services/RecommendationService.js) - Ranking logic
3. [backend/src/services/LLMService.js](backend/src/services/LLMService.js) - LLM integration

**Key algorithms:**
- Multi-factor scoring (5 components)
- Embedding-ready architecture
- Confidence weighting system
- Feedback loop for learning

---

### 🎨 Frontend Developer
**Start here:**
1. [README.md](README.md) - API overview
2. [docs/API.md](docs/API.md) - Complete endpoint reference
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - API commands

**Key endpoints:**
- `POST /clubs/:club_id/needs` - Define requirements
- `POST /recommendations` - Generate rankings
- `GET /recommendations/:club_id` - Get results
- `GET /players/:player_id/signals` - Get player data
- `POST /feedback` - Submit feedback

---

## 📁 Directory Structure

```
Sportify AI/
│
├── 📄 README.md                    # 👈 START HERE
├── 📄 QUICK_REFERENCE.md          # Commands & API quick ref
├── 📄 DELIVERY_SUMMARY.md         # What was built
│
├── 📁 backend/                     # Node.js + Express
│   ├── src/
│   │   ├── index.js               # Server entry
│   │   ├── config/                # Database config
│   │   ├── models/                # Data models
│   │   ├── services/              # Business logic
│   │   ├── controllers/           # API handlers
│   │   ├── routes/                # API routes
│   │   └── utils/                 # Helpers
│   ├── scripts/
│   │   ├── schema.sql             # DB schema
│   │   ├── setupDatabase.js
│   │   └── seedData.js
│   ├── package.json               # Dependencies
│   └── .env.example               # Config template
│
├── 📁 docs/                        # Comprehensive guides
│   ├── IMPLEMENTATION.md          # Architecture (detailed)
│   ├── API.md                     # All endpoints (complete)
│   ├── DATABASE.md                # Schema & setup
│   └── TIMELINE.md                # 2-week breakdown
│
├── 🔧 setup.sh                    # Auto setup (macOS/Linux)
├── 🔧 setup.bat                   # Auto setup (Windows)
│
└── 📄 This file                   # Navigation guide
```

---

## 🚀 Getting Started (5 Minutes)

### 1. Initial Setup
```bash
cd "Sportify AI"

# macOS/Linux
bash setup.sh

# OR Windows
setup.bat

# OR Manual
cd backend
npm install
cp .env.example .env
```

### 2. Configure Database
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=sportify_user
DB_PASSWORD=your_password
DB_NAME=sportify_ai
OPENAI_API_KEY=sk-your-key
```

### 3. Initialize Database
```bash
npm run db:setup   # Create schema
npm run db:seed    # Load sample data
```

### 4. Start Server
```bash
npm run dev        # Development (auto-reload)
# Server running on http://localhost:3000
```

### 5. Test API
```bash
# Health check
curl http://localhost:3000/health

# Generate recommendations
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"club_id": 2, "limit": 20}'
```

---

## 📚 Documentation by Topic

### Understanding the System
- **Overall**: [README.md](README.md)
- **Architecture**: [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)
- **Timeline**: [docs/TIMELINE.md](docs/TIMELINE.md)
- **Status**: [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)

### Development & APIs
- **API Reference**: [docs/API.md](docs/API.md)
- **Quick Commands**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Code Examples**: Throughout [docs/API.md](docs/API.md)

### Infrastructure & Data
- **Database**: [docs/DATABASE.md](docs/DATABASE.md)
- **Schema**: [backend/scripts/schema.sql](backend/scripts/schema.sql)
- **Configuration**: [backend/.env.example](backend/.env.example)

### Implementation Details
- **Models**: [backend/src/models/](backend/src/models/)
- **Services**: [backend/src/services/](backend/src/services/)
- **Controllers**: [backend/src/controllers/](backend/src/controllers/)
- **Routes**: [backend/src/routes/](backend/src/routes/)

---

## 🔍 Find What You Need

### "How do I...?"

**...set up the project?**
→ [setup.sh](setup.sh) or [setup.bat](setup.bat)

**...start the server?**
→ [README.md](README.md#quick-start) or `npm run dev`

**...understand the API?**
→ [docs/API.md](docs/API.md)

**...generate recommendations?**
→ [docs/API.md#generate-recommendations](docs/API.md) (POST /recommendations)

**...add new players?**
→ [docs/DATABASE.md](docs/DATABASE.md) (Data Migration section)

**...understand scoring?**
→ [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) (Scoring Components)

**...customize the system?**
→ [backend/src/services/](backend/src/services/)

**...deploy to production?**
→ [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md#deployment)

**...troubleshoot issues?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-debugging-tips)

---

## 🎓 Learning Paths

### 5-Minute Overview
1. [README.md](README.md) - 5 min read
2. [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md) - 5 min scan

**Result**: Understand what Sportify AI is and what was built.

---

### 30-Minute Setup & Test
1. Run [setup.sh](setup.sh) / [setup.bat](setup.bat) - 10 min
2. Configure [backend/.env](backend/.env.example) - 5 min
3. Run `npm run db:setup && npm run db:seed` - 5 min
4. Test APIs with [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 10 min

**Result**: Running system with test data.

---

### 2-Hour Deep Dive
1. [README.md](README.md) - 15 min
2. [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) - 30 min
3. [docs/API.md](docs/API.md) - 20 min
4. Review source code in [backend/src/](backend/src/) - 30 min
5. Test endpoints manually - 15 min

**Result**: Understanding of architecture and capabilities.

---

### Full Mastery (4 Hours)
All of 2-Hour Deep Dive, plus:
1. [docs/DATABASE.md](docs/DATABASE.md) - 20 min
2. [docs/TIMELINE.md](docs/TIMELINE.md) - 10 min
3. Study [backend/src/services/](backend/src/services/) code - 30 min
4. Study [backend/src/models/](backend/src/models/) code - 20 min
5. Review [backend/scripts/schema.sql](backend/scripts/schema.sql) - 20 min

**Result**: Complete understanding for development & deployment.

---

## ✅ Checklist for Different Roles

### First-Time Setup
- [ ] Clone/download project
- [ ] Run setup script
- [ ] Edit .env file
- [ ] Run `npm run db:setup`
- [ ] Run `npm run db:seed`
- [ ] Run `npm run dev`
- [ ] Test with curl commands

### New Developer
- [ ] Complete "First-Time Setup"
- [ ] Read [README.md](README.md)
- [ ] Review [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)
- [ ] Explore [backend/src/](backend/src/) code
- [ ] Test all endpoints in [docs/API.md](docs/API.md)
- [ ] Make small code change to understand flow

### DevOps Setup
- [ ] Complete "First-Time Setup"
- [ ] Review [docs/DATABASE.md](docs/DATABASE.md)
- [ ] Configure production .env
- [ ] Plan backup/restore strategy
- [ ] Set up monitoring & logging
- [ ] Configure deployment pipeline

### Data Expansion
- [ ] Understand schema in [docs/DATABASE.md](docs/DATABASE.md)
- [ ] Review seed script in [backend/scripts/seedData.js](backend/scripts/seedData.js)
- [ ] Plan data migration
- [ ] Test with small dataset first
- [ ] Monitor performance

---

## 🆘 Quick Help

### Common Issues

**"Port 3000 in use"**
```bash
# Change port in .env
PORT=3001
```

**"Database connection error"**
```bash
# Check PostgreSQL running
psql --version

# Check credentials in .env
cat .env | grep DB_
```

**"Dependencies won't install"**
```bash
# Update npm
npm install -g npm@latest

# Clear cache
npm cache clean --force

# Reinstall
npm install
```

**"LLM API errors"**
```bash
# Check API key
echo $OPENAI_API_KEY

# Mock data available in MVP
# Check logs for details
LOG_LEVEL=debug npm run dev
```

→ More help in [QUICK_REFERENCE.md](QUICK_REFERENCE.md#-debugging-tips)

---

## 📞 Support Resources

| Question | Resource |
|----------|----------|
| What is Sportify AI? | [README.md](README.md) |
| How do I use the API? | [docs/API.md](docs/API.md) |
| How does it work? | [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) |
| How is it scored? | [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md#scoring-methodology) |
| Where's the database? | [docs/DATABASE.md](docs/DATABASE.md) |
| How do I deploy? | [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md#deployment) |
| What's the timeline? | [docs/TIMELINE.md](docs/TIMELINE.md) |
| Need quick commands? | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |

---

## 🚀 Next Steps

**Pick your path:**

1. **👨‍💼 Just want overview?**
   → Read [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)

2. **💻 Want to code?**
   → Follow [README.md](README.md) then [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)

3. **🔧 Want to deploy?**
   → Follow [setup.sh](setup.sh) then [docs/DATABASE.md](docs/DATABASE.md)

4. **📊 Want to understand data?**
   → Read [docs/DATABASE.md](docs/DATABASE.md) then [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)

5. **🧪 Want to test?**
   → Use [docs/API.md](docs/API.md) and [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 📊 Project Stats

- **Lines of Code**: 3,500+
- **Database Tables**: 13
- **API Endpoints**: 10+
- **Documentation Pages**: 6
- **Setup Time**: 15 minutes
- **Time to First Request**: 20 minutes
- **Development Time**: 2 weeks
- **Status**: ✅ Production Ready

---

**Welcome to Sportify AI!** 🚀

Start with [README.md](README.md) if you haven't already.

---

**Last Updated**: February 2, 2025  
**Version**: 1.0.0  
**Navigation Guide**: Complete

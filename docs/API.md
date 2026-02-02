# Sportify AI API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
Current MVP: No authentication required
Production: JWT Bearer token required

---

## 1. Club Needs Management

### Create/Update Club Needs
```
POST /clubs/:club_id/needs
```

**Path Parameters:**
- `club_id` (integer): Unique club identifier

**Request Body:**
```json
{
  "positions_required": ["CM", "CDM"],  // Required: array of position codes
  "age_min": 23,                        // Optional: minimum age
  "age_max": 32,                        // Optional: maximum age
  "budget_min_eur": 40000000,          // Optional: minimum budget in EUR
  "budget_max_eur": 80000000,          // Optional: maximum budget in EUR
  "contract_preference": "permanent",   // Optional: 'permanent', 'loan', 'free'
  "preferred_foot": "left",             // Optional: 'left', 'right', 'both'
  "tactical_style": "pressing",         // Optional: playing style preference
  "urgency_level": "high",              // Optional: 'low', 'medium', 'high'
  "min_experience_years": 3,            // Optional: minimum years at elite level
  "role_archetypes": ["ball_carrier"],  // Optional: tactical role
  "description": "Need midfielder"      // Optional: detailed description
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "club_id": 2,
    "positions_required": ["CM", "CDM"],
    "age_min": 23,
    "age_max": 32,
    "budget_min_eur": 40000000,
    "budget_max_eur": 80000000,
    "created_at": "2025-02-02T10:00:00Z",
    "updated_at": "2025-02-02T10:00:00Z"
  },
  "message": "Club needs profile created/updated"
}
```

---

### Get Club Needs
```
GET /clubs/:club_id/needs
```

**Path Parameters:**
- `club_id` (integer): Unique club identifier

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "club_id": 2,
      "positions_required": ["CM", "CDM"],
      "age_min": 23,
      "age_max": 32,
      "is_active": true,
      "created_at": "2025-02-02T10:00:00Z"
    }
  ]
}
```

---

## 2. Recommendations

### Generate Recommendations
```
POST /recommendations
```

**Request Body:**
```json
{
  "club_id": 2,      // Required: club requesting recommendations
  "limit": 20        // Optional: number of recommendations (default: 20)
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "player_id": 3,
      "club_id": 2,
      "rank_position": 1,
      "full_name": "Rodri Hernández",
      "primary_position": "CDM",
      "age": 27,
      "market_value_eur": 100000000,
      "fit_score": 0.92,
      "performance_score": 0.88,
      "availability_score": 1.0,
      "risk_penalty": 0.0,
      "news_confidence": 0.75,
      "final_score": 0.903,
      "explanation": {
        "top_reasons": [
          "Position match: CDM",
          "Age fit: 27 (target: 23-32)",
          "Recent form score: 88%",
          "Market value: €100,000,000"
        ],
        "stats_evidence": {
          "fit_score": "92",
          "performance_score": "88",
          "availability_score": "100"
        },
        "recent_signals": [
          {
            "type": "form",
            "timestamp": "2025-02-01T15:00:00Z",
            "evidence": "Outstanding performance in Champions League"
          }
        ],
        "risk_indicators": [],
        "recommendation_timestamp": "2025-02-02T10:30:00Z"
      },
      "generated_at": "2025-02-02T10:30:00Z",
      "expires_at": "2025-02-03T10:30:00Z"
    }
  ],
  "count": 20,
  "timestamp": "2025-02-02T10:30:00Z"
}
```

**Scoring Methodology:**
```
Final Score = (Fit Score × 0.35) + (Performance Score × 0.25) + 
              (Availability Score × 0.20) + (News Confidence × 0.15) - 
              (Risk Penalty × 0.05)
```

---

### Get Cached Recommendations
```
GET /recommendations/:club_id
```

**Query Parameters:**
- `limit` (integer, optional): Maximum results (default: 20, max: 100)

**Path Parameters:**
- `club_id` (integer): Club identifier

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "player_id": 3,
      "full_name": "Rodri Hernández",
      "rank_position": 1,
      "final_score": 0.903,
      "explanation": { /* as above */ },
      "generated_at": "2025-02-02T10:30:00Z"
    }
  ],
  "count": 20,
  "timestamp": "2025-02-02T10:45:00Z"
}
```

---

## 3. Players

### Search Players
```
GET /players/search
```

**Query Parameters:**
- `position` (string, optional): Position code (e.g., 'CM', 'ST')
- `club_id` (integer, optional): Current club filter
- `age_min` (integer, optional): Minimum age
- `age_max` (integer, optional): Maximum age
- `limit` (integer, optional): Results limit (default: 50)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 3,
      "external_id": "rodri_1",
      "full_name": "Rodri Hernández",
      "primary_position": "CDM",
      "secondary_positions": ["CM"],
      "age": 27,
      "nationality": "Spain",
      "preferred_foot": "right",
      "market_value_eur": 100000000,
      "contract_end_date": "2027-06-30",
      "contract_status": "active",
      "is_available": true,
      "current_club_id": 1
    }
  ],
  "count": 15
}
```

---

### Get Player Profile
```
GET /players/:player_id
```

**Path Parameters:**
- `player_id` (integer): Player identifier

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "player": {
      "id": 3,
      "full_name": "Rodri Hernández",
      "age": 27,
      "primary_position": "CDM",
      "market_value_eur": 100000000,
      "contract_end_date": "2027-06-30"
    },
    "performance": {
      "season": "2024/2025",
      "matches_played": 18,
      "goals": 1,
      "assists": 2,
      "minutes_played": 1620,
      "passing_accuracy": 0.91,
      "form_score": 0.88,
      "consistency_score": 0.85
    },
    "performance_history": [
      {
        "season": "2024/2025",
        "league": "Premier League",
        "form_score": 0.88
      },
      {
        "season": "2023/2024",
        "league": "Premier League",
        "form_score": 0.92
      }
    ]
  }
}
```

---

### Get Player Signals
```
GET /players/:player_id/signals
```

**Path Parameters:**
- `player_id` (integer): Player identifier

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "player_id": 3,
      "signal_type": "form",
      "signal_value": 0.88,
      "confidence_score": 0.92,
      "source": "performance_data",
      "evidence": "Outstanding display in Champions League",
      "is_risk": false,
      "created_at": "2025-02-01T15:00:00Z"
    },
    {
      "id": 2,
      "player_id": 3,
      "signal_type": "injury",
      "signal_value": 0.3,
      "confidence_score": 0.7,
      "source": "news_extraction",
      "evidence": "Minor muscle issue, expected to return within 2 weeks",
      "is_risk": true,
      "expires_at": "2025-02-09T00:00:00Z",
      "created_at": "2025-02-02T10:00:00Z"
    }
  ],
  "count": 2
}
```

**Signal Types:**
- `injury`: Current injury status
- `suspension`: Disciplinary suspension
- `form`: Recent performance form
- `transfer_rumor`: Transfer speculation
- `contract`: Contract-related news
- `performance`: Statistical milestone

---

## 4. News & Intelligence

### Get News
```
GET /news
```

**Query Parameters:**
- `entity_id` (integer, optional): Player or club ID to filter by
- `entity_type` (string, optional): 'player' or 'club' (default: 'player')
- `limit` (integer, optional): Results limit (default: 50, max: 200)

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Rodri wins Ballon d'Or 2024",
      "content": "Manchester City's Rodri Hernández has won the 2024 Ballon d'Or...",
      "source_name": "Goal.com",
      "published_at": "2025-02-01T15:30:00Z",
      "author": "John Smith",
      "extractions": [
        {
          "event_type": "award",
          "confidence_score": 0.95
        }
      ]
    }
  ],
  "count": 50
}
```

---

### Get News Detail
```
GET /news/:article_id
```

**Path Parameters:**
- `article_id` (integer): News article identifier

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "article": {
      "id": 1,
      "title": "Rodri wins Ballon d'Or 2024",
      "content": "Manchester City's Rodri Hernández has won the 2024 Ballon d'Or...",
      "source_name": "Goal.com",
      "published_at": "2025-02-01T15:30:00Z",
      "ingested_at": "2025-02-01T16:00:00Z"
    },
    "extractions": [
      {
        "id": 1,
        "event_type": "award",
        "confidence_score": 0.95,
        "extracted_entities": {
          "players": ["Rodri Hernández"],
          "clubs": ["Manchester City"]
        },
        "key_facts": [
          "Rodri wins Ballon d'Or 2024",
          "First Manchester City player to win since 2015"
        ],
        "affected_players": [3],
        "affected_clubs": [1],
        "llm_model": "gpt-4-turbo",
        "processing_time_ms": 1240
      }
    ]
  }
}
```

**Event Types:**
- `transfer_confirmed`: Confirmed player transfer
- `transfer_rumor`: Transfer speculation
- `injury`: Injury announcement
- `suspension`: Disciplinary action
- `contract_extension`: Contract renewal
- `form_change`: Performance form change
- `award`: Award or recognition
- `other`: Other significant news

---

## 5. Feedback

### Submit Feedback
```
POST /feedback
```

**Request Body:**
```json
{
  "club_id": 2,                    // Required
  "player_id": 3,                  // Required
  "recommendation_id": 1,          // Optional
  "feedback_type": "interested",   // Required: 'interested', 'not_interested', 'contacted', 'signed'
  "rating": 5,                     // Optional: 1-5 star rating
  "comment": "Excellent fit"       // Optional: detailed feedback
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "club_id": 2,
    "player_id": 3,
    "feedback_type": "interested",
    "rating": 5,
    "comment": "Excellent fit",
    "created_at": "2025-02-02T10:45:00Z"
  },
  "message": "Feedback recorded"
}
```

---

### Get Feedback History
```
GET /feedback/:club_id
```

**Path Parameters:**
- `club_id` (integer): Club identifier

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "club_id": 2,
      "player_id": 3,
      "full_name": "Rodri Hernández",
      "primary_position": "CDM",
      "feedback_type": "interested",
      "rating": 5,
      "comment": "Excellent fit",
      "created_at": "2025-02-02T10:45:00Z"
    }
  ],
  "count": 1
}
```

---

## 6. Health Check

### System Status
```
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-02-02T10:50:00Z",
  "uptime": 3600,
  "service": "Sportify AI Intelligence Engine"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "positions_required must be a non-empty array"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Club needs profile not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Failed to generate recommendations"
}
```

---

## Rate Limiting (Future)

- 100 requests per minute per API key
- 10,000 requests per day per API key
- Burst limit: 20 requests per second

---

## Pagination

For endpoints with large result sets, pagination support coming in v2:

```
GET /news?limit=50&offset=0
```

---

## Webhooks (Future)

Subscribe to real-time updates:

```
POST /webhooks/subscribe
{
  "event_type": "news_extracted",
  "webhook_url": "https://your-app.com/webhooks/news"
}
```

---

**API Version**: 1.0.0
**Last Updated**: February 2, 2025
**Status**: Production Ready (MVP)

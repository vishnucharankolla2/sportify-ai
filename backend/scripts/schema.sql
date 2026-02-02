-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    age INT,
    nationality VARCHAR(100),
    primary_position VARCHAR(50),
    secondary_positions TEXT[],
    preferred_foot VARCHAR(10),
    height_cm INT,
    weight_kg INT,
    market_value_eur BIGINT,
    contract_end_date DATE,
    contract_status VARCHAR(50),
    current_club_id INT,
    is_available BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clubs Table
CREATE TABLE IF NOT EXISTS clubs (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    league VARCHAR(100),
    founded_year INT,
    stadium_name VARCHAR(255),
    official_website VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club Needs/Requirements
CREATE TABLE IF NOT EXISTS club_needs (
    id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES clubs(id),
    positions_required TEXT[] NOT NULL,
    age_min INT,
    age_max INT,
    budget_min_eur BIGINT,
    budget_max_eur BIGINT,
    contract_preference VARCHAR(50),
    preferred_foot VARCHAR(10),
    tactical_style VARCHAR(100),
    urgency_level VARCHAR(50),
    min_experience_years INT,
    role_archetypes TEXT[],
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player Signals (Risk, Form, News Impact)
CREATE TABLE IF NOT EXISTS player_signals (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    signal_type VARCHAR(50) NOT NULL,
    signal_value FLOAT,
    confidence_score FLOAT,
    source VARCHAR(100),
    source_url VARCHAR(500),
    evidence TEXT,
    is_risk BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Player Performance Metrics
CREATE TABLE IF NOT EXISTS player_performance (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    season VARCHAR(20),
    league VARCHAR(100),
    club_id INT REFERENCES clubs(id),
    matches_played INT,
    goals INT,
    assists INT,
    minutes_played INT,
    passing_accuracy FLOAT,
    tackles_per_game FLOAT,
    interceptions_per_game FLOAT,
    dribbles_per_game FLOAT,
    form_score FLOAT,
    consistency_score FLOAT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transfers
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    from_club_id INT REFERENCES clubs(id),
    to_club_id INT REFERENCES clubs(id),
    transfer_date DATE,
    transfer_fee_eur BIGINT,
    status VARCHAR(50),
    is_rumor BOOLEAN DEFAULT false,
    confidence_score FLOAT,
    source_articles TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News Articles
CREATE TABLE IF NOT EXISTS news_articles (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    original_language VARCHAR(10),
    source_name VARCHAR(255),
    source_url VARCHAR(500),
    published_at TIMESTAMP NOT NULL,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(255),
    image_url VARCHAR(500),
    raw_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NLP Extraction Results
CREATE TABLE IF NOT EXISTS news_extractions (
    id SERIAL PRIMARY KEY,
    article_id INT NOT NULL REFERENCES news_articles(id),
    event_type VARCHAR(100),
    confidence_score FLOAT,
    extracted_entities JSONB,
    key_facts JSONB,
    evidence_snippet TEXT,
    affected_players INT[],
    affected_clubs INT[],
    llm_model VARCHAR(100),
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES clubs(id),
    club_need_id INT REFERENCES club_needs(id),
    player_id INT NOT NULL REFERENCES players(id),
    rank_position INT NOT NULL,
    fit_score FLOAT,
    performance_score FLOAT,
    availability_score FLOAT,
    risk_penalty FLOAT,
    news_confidence FLOAT,
    final_score FLOAT,
    explanation JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Loop
CREATE TABLE IF NOT EXISTS club_feedback (
    id SERIAL PRIMARY KEY,
    club_id INT NOT NULL REFERENCES clubs(id),
    recommendation_id INT REFERENCES recommendations(id),
    player_id INT REFERENCES players(id),
    feedback_type VARCHAR(50),
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100),
    entity_id INT,
    action VARCHAR(50),
    old_value JSONB,
    new_value JSONB,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_players_club ON players(current_club_id);
CREATE INDEX idx_players_position ON players(primary_position);
CREATE INDEX idx_players_availability ON players(is_available);
CREATE INDEX idx_player_signals_type ON player_signals(signal_type);
CREATE INDEX idx_player_signals_expires ON player_signals(expires_at);
CREATE INDEX idx_club_needs_active ON club_needs(is_active);
CREATE INDEX idx_recommendations_club ON recommendations(club_id);
CREATE INDEX idx_recommendations_player ON recommendations(player_id);
CREATE INDEX idx_recommendations_score ON recommendations(final_score DESC);
CREATE INDEX idx_news_articles_source ON news_articles(source_name);
CREATE INDEX idx_news_articles_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_extractions_article ON news_extractions(article_id);
CREATE INDEX idx_news_extractions_type ON news_extractions(event_type);

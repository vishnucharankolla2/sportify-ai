const db = require('../src/config/database');
const logger = require('../src/utils/logger');

require('dotenv').config();

/**
 * Seed database with initial player and club data
 */
async function seedDatabase() {
  try {
    logger.info('🌱 Seeding database with initial data...');

    // Create sample clubs
    const clubs = [
      {
        external_id: 'man_city_1',
        name: 'Manchester City FC',
        country: 'England',
        league: 'Premier League',
        founded_year: 1880,
        stadium_name: 'Etihad Stadium'
      },
      {
        external_id: 'liverpool_1',
        name: 'Liverpool FC',
        country: 'England',
        league: 'Premier League',
        founded_year: 1892,
        stadium_name: 'Anfield'
      },
      {
        external_id: 'real_madrid_1',
        name: 'Real Madrid CF',
        country: 'Spain',
        league: 'La Liga',
        founded_year: 1902,
        stadium_name: 'Santiago Bernabéu'
      },
      {
        external_id: 'barca_1',
        name: 'FC Barcelona',
        country: 'Spain',
        league: 'La Liga',
        founded_year: 1899,
        stadium_name: 'Camp Nou'
      },
      {
        external_id: 'juventus_1',
        name: 'Juventus FC',
        country: 'Italy',
        league: 'Serie A',
        founded_year: 1897,
        stadium_name: 'Allianz Stadium'
      },
      {
        external_id: 'psg_1',
        name: 'Paris Saint-Germain',
        country: 'France',
        league: 'Ligue 1',
        founded_year: 1970,
        stadium_name: 'Parc des Princes'
      }
    ];

    for (const club of clubs) {
      try {
        await db.query(
          `INSERT INTO clubs (external_id, name, country, league, founded_year, stadium_name)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (external_id) DO NOTHING`,
          [club.external_id, club.name, club.country, club.league, club.founded_year, club.stadium_name]
        );
      } catch (err) {
        logger.warn(`Could not insert club ${club.name}: ${err.message}`);
      }
    }

    logger.info(`✓ Seeded ${clubs.length} clubs`);

    // Create sample players
    const players = [
      {
        external_id: 'haaland_ek_1',
        first_name: 'Erling',
        last_name: 'Haaland',
        full_name: 'Erling Haaland',
        date_of_birth: '2000-07-21',
        nationality: 'Norway',
        primary_position: 'ST',
        secondary_positions: ['CF'],
        preferred_foot: 'left',
        height_cm: 194,
        weight_kg: 88,
        market_value_eur: 150000000,
        contract_end_date: '2027-06-30',
        contract_status: 'active',
        current_club_id: 1
      },
      {
        external_id: 'salah_mo_1',
        first_name: 'Mohamed',
        last_name: 'Salah',
        full_name: 'Mohamed Salah',
        date_of_birth: '1992-06-15',
        nationality: 'Egypt',
        primary_position: 'RW',
        secondary_positions: ['ST', 'CAM'],
        preferred_foot: 'left',
        height_cm: 175,
        weight_kg: 78,
        market_value_eur: 90000000,
        contract_end_date: '2026-06-30',
        contract_status: 'active',
        current_club_id: 2
      },
      {
        external_id: 'rodri_1',
        first_name: 'Rodri',
        last_name: 'Hernández',
        full_name: 'Rodri Hernández Cascante',
        date_of_birth: '1996-06-22',
        nationality: 'Spain',
        primary_position: 'CDM',
        secondary_positions: ['CM'],
        preferred_foot: 'right',
        height_cm: 190,
        weight_kg: 82,
        market_value_eur: 100000000,
        contract_end_date: '2027-06-30',
        contract_status: 'active',
        current_club_id: 1
      },
      {
        external_id: 'vinicius_1',
        first_name: 'Vinícius',
        last_name: 'Júnior',
        full_name: 'Vinícius José Paixão de Oliveira Júnior',
        date_of_birth: '2000-07-12',
        nationality: 'Brazil',
        primary_position: 'LW',
        secondary_positions: ['ST'],
        preferred_foot: 'left',
        height_cm: 180,
        weight_kg: 76,
        market_value_eur: 110000000,
        contract_end_date: '2027-06-30',
        contract_status: 'active',
        current_club_id: 3
      },
      {
        external_id: 'bellingham_1',
        first_name: 'Jude',
        last_name: 'Bellingham',
        full_name: 'Jude Victor William Bellingham',
        date_of_birth: '2003-06-17',
        nationality: 'England',
        primary_position: 'CM',
        secondary_positions: ['CAM', 'CDM'],
        preferred_foot: 'left',
        height_cm: 186,
        weight_kg: 86,
        market_value_eur: 120000000,
        contract_end_date: '2029-06-30',
        contract_status: 'active',
        current_club_id: 3
      },
      {
        external_id: 'mbappe_1',
        first_name: 'Kylian',
        last_name: 'Mbappé',
        full_name: 'Kylian Mbappé Lottin',
        date_of_birth: '1998-12-20',
        nationality: 'France',
        primary_position: 'ST',
        secondary_positions: ['LW', 'RW'],
        preferred_foot: 'right',
        height_cm: 178,
        weight_kg: 73,
        market_value_eur: 180000000,
        contract_end_date: '2026-06-30',
        contract_status: 'active',
        current_club_id: 3
      }
    ];

    for (const player of players) {
      try {
        await db.query(
          `INSERT INTO players 
           (external_id, first_name, last_name, full_name, date_of_birth, nationality,
            primary_position, secondary_positions, preferred_foot, height_cm, weight_kg,
            market_value_eur, contract_end_date, contract_status, current_club_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           ON CONFLICT (external_id) DO NOTHING`,
          [player.external_id, player.first_name, player.last_name, player.full_name,
           player.date_of_birth, player.nationality, player.primary_position,
           player.secondary_positions, player.preferred_foot, player.height_cm,
           player.weight_kg, player.market_value_eur, player.contract_end_date,
           player.contract_status, player.current_club_id]
        );
      } catch (err) {
        logger.warn(`Could not insert player ${player.full_name}: ${err.message}`);
      }
    }

    logger.info(`✓ Seeded ${players.length} players`);

    // Create sample club needs
    const needs = [
      {
        club_id: 2, // Liverpool
        positions_required: ['CM', 'CDM'],
        age_min: 23,
        age_max: 32,
        budget_max_eur: 80000000,
        tactical_style: 'pressing',
        urgency_level: 'high'
      },
      {
        club_id: 4, // Barcelona
        positions_required: ['ST', 'RW'],
        age_min: 24,
        age_max: 35,
        budget_max_eur: 60000000,
        tactical_style: 'possession',
        urgency_level: 'medium'
      },
      {
        club_id: 5, // Juventus
        positions_required: ['CDM'],
        age_min: 25,
        age_max: 33,
        budget_max_eur: 50000000,
        tactical_style: 'defensive',
        urgency_level: 'low'
      }
    ];

    for (const need of needs) {
      try {
        await db.query(
          `INSERT INTO club_needs 
           (club_id, positions_required, age_min, age_max, budget_max_eur, tactical_style, urgency_level)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [need.club_id, need.positions_required, need.age_min, need.age_max,
           need.budget_max_eur, need.tactical_style, need.urgency_level]
        );
      } catch (err) {
        logger.warn(`Could not insert club needs: ${err.message}`);
      }
    }

    logger.info(`✓ Seeded ${needs.length} club needs profiles`);
    logger.info('✓ Database seeding completed successfully');

  } catch (error) {
    logger.error(`❌ Database seeding failed: ${error.message}`);
    process.exit(1);
  }
}

seedDatabase();

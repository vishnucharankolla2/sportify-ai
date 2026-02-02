const { OpenAI } = require('openai');
const logger = require('../utils/logger');

/**
 * LLM Service - Handles news extraction and signal generation
 */
class LLMService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo';
  }

  /**
   * Extract structured signals from football news
   */
  async extractSignalsFromNews(article, language = 'en') {
    try {
      const startTime = Date.now();

      const systemPrompt = this._getSystemPrompt(language);
      const userPrompt = this._getUserPrompt(article);

      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: parseFloat(process.env.LLM_TEMPERATURE || 0.3),
        max_tokens: parseInt(process.env.LLM_MAX_TOKENS || 1024),
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const processingTime = Date.now() - startTime;
      const content = response.choices[0].message.content;
      const parsed = this._parseExtraction(content);

      return {
        success: true,
        event_type: parsed.event_type,
        confidence_score: parsed.confidence_score,
        extracted_entities: parsed.entities,
        key_facts: parsed.facts,
        evidence_snippet: article.content.substring(0, 500),
        processing_time_ms: processingTime,
        llm_model: this.model,
        raw_response: content
      };
    } catch (error) {
      logger.error(`LLM extraction error: ${error.message}`);
      return {
        success: false,
        error: error.message,
        confidence_score: 0
      };
    }
  }

  /**
   * Generate explanations for recommendations
   */
  async generateExplanation(player, recommendation, language = 'en') {
    try {
      const prompt = `
You are a football expert. Explain why ${player.full_name} is recommended for the club's needs.

Player Profile:
- Position: ${player.primary_position}
- Age: ${player.age}
- Current Club: [Club Name]
- Market Value: €${player.market_value_eur}
- Recent Form Score: ${recommendation.performance_score}

Club Needs:
- Positions: ${recommendation.positions_required}
- Age Range: ${recommendation.age_min}-${recommendation.age_max}
- Budget: €${recommendation.budget_min_eur}-${recommendation.budget_max_eur}

Fit Score: ${recommendation.fit_score}
Availability Score: ${recommendation.availability_score}

Provide 3-4 concise key reasons for this recommendation, highlighting stats and recent news.
Format as JSON: { "reasons": ["reason 1", "reason 2", ...], "key_stats": {...}, "risks": [...] }
      `;

      const response = await this.client.chat.completions.create({
        model: this.model,
        temperature: 0.3,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return parsed;
    } catch (error) {
      logger.error(`Explanation generation error: ${error.message}`);
      return {
        reasons: ['Unable to generate explanation'],
        key_stats: {},
        risks: []
      };
    }
  }

  _getSystemPrompt(language) {
    const prompts = {
      en: `You are a football intelligence analyst. Extract structured information from football news articles.
      
For each article, identify:
1. Event Type (transfer_rumor, transfer_confirmed, injury, suspension, contract_extension, form_change)
2. Confidence Score (0-1)
3. Entities (player names, club names)
4. Key facts extracted directly from the text
5. Risk indicators

CRITICAL: Do NOT treat rumors as confirmed facts. Mark confidence < 0.7 for rumors.
Extract ONLY facts explicitly stated in the text.
Never invent or assume information.`,

      ar: `أنت محلل ذكاء كرة قدم. استخرج المعلومات المنظمة من مقالات أخبار كرة القدم.
      
لكل مقالة، حدد:
1. نوع الحدث (شائعة انتقال، انتقال مؤكد، إصابة، إيقاف، تمديد عقد)
2. درجة الثقة (0-1)
3. الكيانات (أسماء اللاعبين، أسماء الأندية)
4. الحقائق الأساسية المستخرجة مباشرة من النص
5. مؤشرات المخاطر

حرج: لا تعامل الشائعات كحقائق مؤكدة.`,

      de: `Sie sind ein Fußball-Intelligenzanalyst. Extrahieren Sie strukturierte Informationen aus Fußballnachrichtenartikeln.

Für jeden Artikel identifizieren Sie:
1. Ereignistyp (Wechselgerücht, Wechsel bestätigt, Verletzung, Sperre, Vertragsverlängerung)
2. Zuverlässigkeitsscore (0-1)
3. Entitäten (Spielernamen, Vereinsnamen)
4. Schlüsseltatsachen direkt aus dem Text
5. Risikoindikatoren`
    };

    return prompts[language] || prompts.en;
  }

  _getUserPrompt(article) {
    return `Article: ${article.title}
Source: ${article.source_name}
Published: ${article.published_at}

Content:
${article.content}

Extract structured signals in JSON format:
{
  "event_type": "string",
  "confidence_score": number,
  "entities": {
    "players": ["name1", "name2"],
    "clubs": ["club1", "club2"]
  },
  "facts": ["fact1", "fact2"],
  "is_rumor": boolean
}`;
  }

  _parseExtraction(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      logger.warn('Failed to parse LLM response as JSON');
    }

    return {
      event_type: 'unknown',
      confidence_score: 0.3,
      entities: { players: [], clubs: [] },
      facts: [content.substring(0, 200)],
      is_rumor: true
    };
  }
}

module.exports = new LLMService();

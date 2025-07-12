import { chatWithGroq } from './groqClient.js';

/**
 * Analyze text for fluency scoring and corrections
 * @param {string} userText - User's input text
 * @returns {Promise<Object>} - Analysis result with score, corrections, and feedback
 */
export async function analyzeTextFluency(userText) {
  try {
    const analysisPrompt = `You are an expert English fluency coach. Analyze this text for grammar, vocabulary, sentence structure, and overall fluency.

Text to analyze: "${userText}"

Please respond with a JSON object in this exact format:
{
  "score": 8,
  "corrected": "The corrected version of the text",
  "feedback": "Brief explanation of issues found",
  "corrections": [
    {
      "original": "incorrect phrase",
      "corrected": "correct phrase", 
      "type": "grammar"
    }
  ],
  "reply": "Natural, encouraging response that addresses the content while gently teaching"
}

Scoring guidelines:
- 9-10: Near-native fluency, minimal issues
- 7-8: Good fluency, minor grammar/vocabulary issues
- 5-6: Intermediate, some structural problems
- 3-4: Basic level, multiple errors but understandable
- 1-2: Beginner level, significant issues affecting meaning

Keep the reply conversational, encouraging, and include a follow-up question. Be specific about corrections but gentle in tone.`;

    const response = await chatWithGroq([
      { role: 'system', content: 'You are a helpful English fluency analyzer. Always respond with valid JSON.' },
      { role: 'user', content: analysisPrompt }
    ]);

    // Try to parse the JSON response
    try {
      const analysis = JSON.parse(response);
      
      // Validate required fields
      if (!analysis.score || !analysis.corrected || !analysis.reply) {
        throw new Error('Missing required fields in analysis');
      }
      
      // Ensure score is within range
      analysis.score = Math.max(1, Math.min(10, analysis.score));
      
      // Ensure corrections array exists
      if (!analysis.corrections) {
        analysis.corrections = [];
      }
      
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse AI analysis response:', parseError);
      return getFallbackAnalysis(userText);
    }
  } catch (error) {
    console.error('Error in fluency analysis:', error);
    return getFallbackAnalysis(userText);
  }
}

/**
 * Fallback analysis using simple heuristics
 * @param {string} userText - User's input text
 * @returns {Object} - Basic analysis result
 */
function getFallbackAnalysis(userText) {
  const text = userText.trim();
  let score = 7; // Default decent score
  let issues = [];
  
  // Simple heuristic checks
  if (text.length < 5) {
    score -= 2;
    issues.push("Very short response");
  }
  
  if (!text.match(/^[A-Z]/)) {
    score -= 1;
    issues.push("Should start with capital letter");
  }
  
  if (!text.match(/[.!?]$/)) {
    score -= 1;
    issues.push("Missing punctuation at end");
  }
  
  // Check for common grammar issues
  if (text.match(/\bi am\b/i) && !text.match(/\bI am\b/)) {
    score -= 1;
    issues.push("'I' should be capitalized");
  }
  
  score = Math.max(1, Math.min(10, score));
  
  return {
    score,
    corrected: text,
    feedback: issues.length > 0 ? `Consider: ${issues.join(', ')}.` : "Good work!",
    corrections: [],
    reply: "Thank you for sharing! Keep practicing your English. What would you like to talk about next?"
  };
}

/**
 * Enhanced system prompt for TalkBuddy that includes fluency coaching
 */
export function getEnhancedSystemPrompt() {
  return `You are TalkBuddy, a friendly and intelligent English fluency coach. Your role is to help users improve their spoken English through natural conversation while providing gentle, constructive feedback.

For every user message, you should:
1. Provide a natural, encouraging response to their content
2. Gently correct any grammar, vocabulary, or structure issues
3. Give a fluency score (1-10) based on their English level
4. Ask a relevant follow-up question to continue the conversation

Guidelines:
- Always be encouraging and supportive
- Make corrections feel natural, not like harsh criticism
- Acknowledge what they did well before mentioning improvements
- Keep responses conversational (2-4 sentences)
- Adapt your language level to slightly above theirs to help them improve
- Focus on the most important errors, don't overwhelm with too many corrections

Scoring criteria:
- 9-10: Near-native fluency, very minor issues
- 7-8: Good communication, minor grammar/vocabulary issues  
- 5-6: Intermediate level, some structural problems but clear meaning
- 3-4: Basic level, multiple errors but still understandable
- 1-2: Beginner level, significant issues affecting comprehension

Remember: Your goal is to build confidence while gradually improving their English skills.`;
}

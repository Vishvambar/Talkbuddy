import { chatWithGroq } from './groqClient.js';

/**
 * Analyze text for fluency scoring and corrections
 * @param {string} userText - User's input text
 * @returns {Promise<Object>} - Analysis result with score, corrections, and feedback
 */
export async function analyzeTextFluency(userText) {
  try {
    const analysisPrompt = `You are TalkBuddy, a friendly and enthusiastic English conversation coach! You're like a supportive friend who loves helping people improve their English through engaging conversations.

Text to analyze: "${userText}"

Your personality:



You are TalkBuddy, an AI-powered spoken English coach helping non-native learners improve their fluency.

Your job is to help the user speak English more fluently and confidently. Every time the user sends a message, follow these exact steps:

1. Understand the message and reply naturally in correct, simple English (1–3 short sentences).
2. If the message contains any grammar, sentence structure, pronunciation, or vocabulary issues, point them out politely and clearly.
3. Suggest the corrected version of the user’s sentence, even if the original was understandable.
4. Give a fluency score from 1 to 10 based on the message's grammar, clarity, completeness, and fluency.
5. Ask a friendly, relevant follow-up question to keep the conversation going.
6. Force to Structure every time 



Please respond with a JSON object in this exact format:
{
  "score": 8,
  "corrected": "The corrected version of the text",
  "feedback": "Brief, encouraging explanation of improvements",
  "corrections": [
    {
      "original": "incorrect phrase",
      "corrected": "correct phrase", 
      "type": "grammar"
    }
  ],
  "reply": "Engaging, conversational response that responds to their message AND asks an interesting follow-up question"
}

Scoring guidelines:
- 9-10: Excellent! Near-native fluency
- 7-8: Great job! Minor tweaks needed
- 5-6: Good progress! Some areas to improve
- 3-4: Nice try! Let's work on structure
- 1-2: Great start! Keep practicing

Reply guidelines:
1. ALWAYS respond to what they actually said (show you're listening!)
2. Give gentle corrections naturally in conversation
3. Ask engaging follow-up questions like:
   - "What's your favorite part about...?"
   - "How did that make you feel?"
   - "Have you ever tried...?"
   - "What do you think about...?"
   - "Tell me more about..."
4. Keep it conversational, not academic
5. Show genuine curiosity about their thoughts and experiences
6. Make them want to continue the conversation!
Also give:
- 1 sentence explanation
- Corrected version
Examples of engaging responses:
- If they mention food: "That sounds delicious! What's your favorite dish to cook at home?"
- If they talk about work: "That must be interesting! What's the best part of your job?"
- If they share an experience: "Wow, that sounds exciting! How did you feel when that happened?"

Make every conversation feel like talking to an interested friend who wants to help them improve!`;

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
  
  // Generate engaging replies based on content
  const generateEngagingReply = (text, score) => {
    const lowercaseText = text.toLowerCase();
    
    // Topic-based responses
    if (lowercaseText.includes('food') || lowercaseText.includes('eat') || lowercaseText.includes('cook')) {
      return "Food is such a great topic! What's your favorite dish to cook or eat? I'd love to hear about the flavors you enjoy!";
    }
    if (lowercaseText.includes('work') || lowercaseText.includes('job')) {
      return "Work can be such an interesting topic! What do you enjoy most about your job? What makes a good day at work for you?";
    }
    if (lowercaseText.includes('travel') || lowercaseText.includes('trip') || lowercaseText.includes('visit')) {
      return "Travel stories are always exciting! Where would you love to visit next? What's the most beautiful place you've been to?";
    }
    if (lowercaseText.includes('family') || lowercaseText.includes('friend')) {
      return "Family and friends are so important! Tell me about someone special in your life. What makes them amazing?";
    }
    if (lowercaseText.includes('hobby') || lowercaseText.includes('like') || lowercaseText.includes('enjoy')) {
      return "I love hearing about people's interests! What got you started with that hobby? How does it make you feel when you do it?";
    }
    if (lowercaseText.includes('book') || lowercaseText.includes('read') || lowercaseText.includes('movie')) {
      return "That sounds interesting! What kind of stories do you enjoy most? Have you discovered anything amazing recently?";
    }
    
    // Score-based encouraging responses
    if (score >= 7) {
      return "You're doing fantastic! Your English is really flowing well. What's something you're excited about these days?";
    } else if (score >= 5) {
      return "Great progress! I can see you're getting more comfortable with English. What would you like to practice talking about?";
    } else {
      return "You're doing great - keep going! Every conversation helps you improve. What's something that makes you happy?";
    }
  };

  return {
    score,
    corrected: text,
    feedback: issues.length > 0 ? `Just a few small things to polish: ${issues.join(', ')}. You're doing well!` : "Excellent work!",
    corrections: [],
    reply: generateEngagingReply(text, score)
  };
}

/**
 * Enhanced system prompt for TalkBuddy that includes fluency coaching
 */
export function getEnhancedSystemPrompt() {
  return `You are TalkBuddy, a warm and enthusiastic English conversation coach! Think of yourself as the user's supportive friend who genuinely cares about their progress and wants to have interesting conversations.

Your mission: Make English practice feel like chatting with a curious, encouraging friend!

For every user message, you should:
1. Respond naturally to what they shared (show you're really listening!)
2. Gently weave in corrections through natural conversation
3. Ask engaging follow-up questions that make them want to keep talking
4. Celebrate their progress and boost their confidence

Your personality traits:
- Genuinely curious about their life, thoughts, and experiences
- Warm and encouraging, never judgmental
- Enthusiastic about their progress, no matter how small
- Great at asking questions that lead to interesting conversations
- Supportive like a good friend, helpful like a great teacher

Conversation starters and follow-ups you love:
- "That sounds really interesting! Tell me more about..."
- "How did that make you feel?"
- "What's your favorite part about...?"
- "Have you ever experienced something similar?"
- "That reminds me of... What do you think about...?"
- "What would you do if...?"
- "I'm curious - why did you choose...?"

Guidelines:
- ALWAYS acknowledge what they shared before giving any corrections
- Make every correction feel like helpful advice from a friend
- Ask questions that relate to their interests and experiences
- Keep responses conversational and engaging (2-4 sentences)
- Show genuine excitement about their topics
- Help them feel comfortable making mistakes

Scoring approach:
- 9-10: "Wow, excellent English! You're doing amazing!"
- 7-8: "Great job! Just a tiny tweak and you're perfect!"
- 5-6: "You're making great progress! Let's polish this up!"
- 3-4: "Good effort! Let's work on making this even clearer!"
- 1-2: "Great start! Keep practicing - you're doing well!"

Remember: Every conversation should feel enjoyable and make them excited to practice more English!`;
}

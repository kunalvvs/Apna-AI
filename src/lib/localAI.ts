import { Message } from '../types/chat';

const responses = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What would you like to know?",
    "Greetings! I'm here to assist you.",
  ],
  farewell: [
    "Goodbye! Have a great day!",
    "Take care! Feel free to return if you have more questions.",
    "Until next time! Stay curious!",
  ],
  unknown: [
    "I understand your question. Could you please provide more details?",
    "That's an interesting topic. Let me help you explore it further.",
    "I'd be happy to help you with that. What specific aspects would you like to know about?",
  ],
};

function getRandomResponse(category: keyof typeof responses): string {
  const categoryResponses = responses[category];
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
}

function analyzeMessage(message: string): keyof typeof responses {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return 'greeting';
  }
  if (lowerMessage.match(/\b(bye|goodbye|farewell|see you)\b/)) {
    return 'farewell';
  }
  return 'unknown';
}

export async function generateLocalResponse(message: string): Promise<string> {
  // Simulate network delay for more realistic feel
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const category = analyzeMessage(message);
  return getRandomResponse(category);
}
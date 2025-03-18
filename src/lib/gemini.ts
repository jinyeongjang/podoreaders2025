import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key - please add it to your .env.local file');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// 채팅 히스토리 타입 정의
interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export class GeminiChat {
  private chat;
  private history: ChatMessage[] = [];

  constructor() {
    this.chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
  }

  async sendMessage(message: string) {
    try {
      // 사용자 메시지 저장
      this.history.push({ role: 'user', content: message });

      // 대화 스타일 설정
      const prompt = `당신은 크리스천 교역자로써 하나님의 나라에 대해 깊게 고민하고 신앙적이고 따뜻한 그리스도인의 어조로 답변해줘. 대화는 무조건 존댓말로 해줘. 기원합니다와 같은 답변은 하지 않아야되. 개역개정으로 답변을 해줘. 대화는 이전대화와 연결되고 이전맥락과 연결되게 해줘. 최대한 성경말씀과 질문과 답변이 어울리게 해줘. 질문: ${message}`;

      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      const botMessage = response.text();

      // 봇 응답 저장
      this.history.push({ role: 'model', content: botMessage });

      return botMessage;
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      throw new Error('Failed to get response from Gemini API');
    }
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
    this.chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
  }
}

// 단일 메시지 전송용 함수 (이전 버전과의 호환성 유지)
export const geminiChat = async (prompt: string) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get response from Gemini API');
  }
};

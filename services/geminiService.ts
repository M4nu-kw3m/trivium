
import { GoogleGenAI, Type } from '@google/genai';
import { TriviaQuestion } from '../types';

const triviaSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: 'The trivia question text.',
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 4 possible answers, one of which is correct.',
      },
      correctAnswer: {
        type: Type.STRING,
        description: 'The correct answer, which must be one of the strings in the options array.',
      },
    },
    required: ['question', 'options', 'correctAnswer'],
  },
};

export const fetchTriviaQuestions = async (category: string): Promise<TriviaQuestion[] | null> => {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API_KEY:', API_KEY ? 'Found' : 'Not found', 'Length:', API_KEY?.length);
    console.log('All env vars:', import.meta.env);
    if (!API_KEY) {
      console.error("VITE_GEMINI_API_KEY environment variable is not set");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `Generate 10 trivia questions for the category: "${category}".
    The questions should be multiple choice with exactly 4 options.
    The difficulty should be medium. Ensure the correctAnswer property is an exact match to one of the strings in the options array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: triviaSchema,
      },
    });

    const responseText = response.text.trim();
    const questions = JSON.parse(responseText);

    // Basic validation
    if (Array.isArray(questions) && questions.length > 0 && questions[0].question) {
      return questions.map(q => ({
        ...q,
        // Shuffle options for variety
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
    }
    return null;

  } catch (error) {
    console.error('Error fetching trivia questions:', error);
    return null;
  }
};

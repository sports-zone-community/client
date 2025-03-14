import api from './api.ts';

export const getSuggestion = async (prompt: string): Promise<string> => {
  const response = await api.post<{ suggestion: string }>('chats/ai/suggestion', { prompt });
  return response.data.suggestion;
};

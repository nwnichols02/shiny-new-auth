// src/utils/token.utils.ts
import { AuthTokens } from './types';

const TOKEN_KEY = 'auth_tokens';

export const tokenStorage = {
  saveTokens(tokens: AuthTokens) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  },

  getTokens(): AuthTokens | null {
    const tokens = localStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  },

  clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// src/auth/auth.config.ts
import { AuthTokens, User, LoginCredentials } from './types';
import { authService } from './api';
import { tokenStorage } from './token';
import { configureAuth } from 'react-query-auth';

export const authConfig = {
  userFn: async () => {
    const tokens = await authService.getUser(tokenStorage.getTokens()!.accessToken);
    // tokenStorage.saveTokens(tokens);
    return tokens;
  },
  loginFn: async (credentials: LoginCredentials): Promise<User> => {
    // const tokens = await authService.login(credentials);
    // tokenStorage.saveTokens(tokens);
    // return tokens;
    const tokens = await authService.login(credentials);
    tokenStorage.saveTokens(tokens);
    const user = await authService.getUser(tokens.accessToken);
    return user;
  },

  registerFn: async (credentials: any) => {
    const tokens = await authService.login(credentials);
    tokenStorage.saveTokens(tokens);
    const user = await authService.getUser(tokens.accessToken);
    return user;
  },

  logoutFn: async () => {
    await authService.logout();
    tokenStorage.clearTokens();
  },

  loadUser: async () => {
    const tokens = tokenStorage.getTokens();
    if (!tokens?.accessToken) return null;
    
    try {
      return await authService.getUser(tokens.accessToken);
    } catch (error) {
      tokenStorage.clearTokens();
      throw error;
    }
  },

  refreshToken: async () => {
    const tokens = tokenStorage.getTokens();
    if (!tokens?.refreshToken) throw new Error('No refresh token');

    const newTokens = await authService.refreshToken(tokens.refreshToken);
    tokenStorage.saveTokens(newTokens);
    return newTokens;
  }
};

export const { useUser, useLogin, useLogout, AuthLoader } = configureAuth(authConfig);
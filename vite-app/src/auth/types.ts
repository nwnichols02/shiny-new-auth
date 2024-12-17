import { Actions, Subjects } from "../ability/types";

// src/types/auth.types.ts
export interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: PermissionRule[];
    parentRole?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }

  export interface PermissionRule {
    action: Actions;
    subject: Subjects;
    conditions?: Record<string, any>;
    fields?: string[];
    inverted?: boolean; // For explicitly denying permissions
  }
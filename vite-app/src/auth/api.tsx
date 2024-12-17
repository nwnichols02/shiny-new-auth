// src/services/auth.service.ts
import axios from 'axios';
import { LoginCredentials, AuthTokens, User, Role } from './types';
import { Actions, Rule, Subjects } from '../ability/types';
import { AuditEntry, IAuditEntry } from '../routes/audit';

const API_URL = 'your-api-url';

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: [{ action: 'manage', subject: 'all' }],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Department management',
    permissions: [
      { action: 'read', subject: 'User' },
      { action: 'update', subject: 'User' },
    ],
    parentRole: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic user access',
    permissions: [
      { action: 'read', subject: 'User', conditions: { id: '${user.id}' } },
    ],
    parentRole: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  },
];

const mockRules: Rule[] = [
  {
    id: '1',
    name: 'Admin Access',
    description: 'Full system access for administrators',
    conditions: [],
    actions: ['manage'],
    subjects: ['all'],
    isActive: true,
    priority: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more mock rules
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    roles: ['admin'],
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    roles: ['manager'],
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    roles: ['user'],
  },
];

const DELAY = 500; // Simulate network delay

const generateToken = (user: User): string => {
  return btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, DELAY));

    const user = mockUsers.find((u: any) => u.email === credentials.email);

    if (!user || credentials.password !== 'password') { // Simple password check
      throw new Error('Invalid credentials');
    }

    const tokens: AuthTokens = {
      accessToken: generateToken(user),
      refreshToken: generateToken(user) + '_refresh',
    };

    // Store user info in localStorage for mock persistence
    localStorage.setItem('mock_user', JSON.stringify(user));

    return tokens;
  },

  async getUser(accessToken: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, DELAY));

    // Validate token (simple check)
    if (!accessToken) {
      throw new Error('Invalid token');
    }

    // In real implementation, you'd decode the token and fetch user
    // Here we'll just return the stored mock user
    const storedUser = localStorage.getItem('mock_user');
    if (!storedUser) {
      throw new Error('User not found');
    }

    return JSON.parse(storedUser);
  },

  async refreshToken(token: string): Promise<AuthTokens> {
    await new Promise(resolve => setTimeout(resolve, DELAY));

    // Validate refresh token (simple check)
    if (!token || !token.endsWith('_refresh')) {
      throw new Error('Invalid refresh token');
    }

    // Get stored user
    const storedUser = localStorage.getItem('mock_user');
    if (!storedUser) {
      throw new Error('User not found');
    }

    const user = JSON.parse(storedUser);

    return {
      accessToken: generateToken(user),
      refreshToken: generateToken(user) + '_refresh',
    };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, DELAY));

    // Clear stored user
    localStorage.removeItem('mock_user');
  },

  // Helper method for development
  async simulateExpiredToken(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    localStorage.removeItem('mock_user');
    throw new Error('Token expired');
  }
};

// Optional: Add error simulation
export const simulateRandomError = async (): Promise<void> => {
  if (Math.random() < 0.1) { // 10% chance of error
    throw new Error('Random network error');
  }
};

export const rolesService = {
  async getRoles(): Promise<Role[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRoles), 500);
    });
  },

  async updateRole(role: Role): Promise<Role> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(role), 500);
    });
  },

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const newRole = {
      ...role,
      id: Math.random().toString(36).substr(2, 9),
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(newRole), 500);
    });
  },
};

export const rulesService = {
  async getRules(): Promise<Rule[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRules), 500);
    });
  },

  async updateRule(rule: Rule): Promise<Rule> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(rule), 500);
    });
  },
};

export interface PermissionMatrix {
  roleId: string;
  roleName: string;
  permissions: {
    subjectId: Subjects;
    actions: Actions[];
  }[];
}

export const permissionsService = {
  async getPermissionMatrix(): Promise<PermissionMatrix[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        {
          roleId: '1',
          roleName: 'Admin',
          permissions: [
            { subjectId: 'User', actions: ['create', 'read', 'update', 'delete'] },
            { subjectId: 'Role', actions: ['create', 'read', 'update', 'delete'] },
          ]
        },
        // Add more roles
      ]), 500);
    });
  },

  async updatePermission(
    roleId: string,
    subjectId: string,
    actions: Actions[]
  ): Promise<void> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },
};

export interface AuditLogResponse {
  logs: IAuditEntry[];
  nextCursor?: number;
  totalCount: number;
}
const ITEMS_PER_PAGE = 10;

export const mockAuditLogs: IAuditEntry[] = Array.from({ length: 50 }, (_, index) => ({
  id: `audit-${index + 1}`,
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  userId: `user-${Math.floor(Math.random() * 3) + 1}`,
  userName: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
  action: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PERMISSION_CHANGE'][
    Math.floor(Math.random() * 6)
  ],
  resource: ['User', 'Role', 'Permission', 'Document'][Math.floor(Math.random() * 4)],
  details: {
    changes: { field: 'status', from: 'draft', to: 'published' },
    metadata: { browser: 'Chrome', os: 'Windows' }
  },
  status: Math.random() > 0.1 ? 'success' : 'failure' as 'failure' | 'success',
  ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
})).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

export const auditService = {
  async getAuditLogs(page: number): Promise<AuditLogResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const hasMore = endIndex < mockAuditLogs.length;

    return {
      logs: mockAuditLogs.slice(startIndex, endIndex),
      nextCursor: hasMore ? page + 1 : undefined,
      totalCount: mockAuditLogs.length
    };
  }
};
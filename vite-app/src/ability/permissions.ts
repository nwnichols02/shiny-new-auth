// src/config/permissions.config.ts
import { PermissionRule } from './types';

export const rolePermissions: Record<string, PermissionRule[]> = {
  admin: [
    { action: 'manage', subject: 'all' }
  ],
  manager: [
    { action: 'read', subject: 'User' },
    { action: 'update', subject: 'User' },
    { action: 'read', subject: 'Report' },
    { action: 'create', subject: 'Report' }
  ],
  user: [
    { action: 'read', subject: 'User', conditions: { id: '${user.id}' } },
    { action: 'read', subject: 'Report', conditions: { ownerId: '${user.id}' } }
  ]
};

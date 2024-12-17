// src/auth/ability.factory.ts
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { User } from '../auth/types';
import { AppAbility, Actions, Subjects } from './types';
import { rolePermissions } from './permissions';

export function defineAbilityFor(user: User): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (!user) {
    can('read', 'all');
    return build();
  }

  // Apply role-based permissions
  user.roles.forEach(role => {
    const permissions = rolePermissions[role];
    if (permissions) {
      permissions.forEach(rule => {
        if (rule.conditions) {
          // Replace template strings with actual user values
          const conditions = JSON.parse(
            JSON.stringify(rule.conditions).replace(/\${user\.id}/g, user.id)
          );
          can(rule.action, rule.subject, conditions);
        } else {
          can(rule.action, rule.subject);
        }
      });
    }
  });

  return build();
}

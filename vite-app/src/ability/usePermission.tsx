// src/hooks/usePermission.ts
import { useAbility } from './AbilityContext';
import { Actions, Subjects } from './types';

export function usePermission() {
    const ability = useAbility();

    return {
        can: (action: Actions, subject: Subjects, field?: string) => {
            return field
                ? ability.can(action, subject, field)
                : ability.can(action, subject);
        },
        cannot: (action: Actions, subject: Subjects, field?: string) => {
            return field
                ? ability.cannot(action, subject, field)
                : ability.cannot(action, subject);
        }
    };
}

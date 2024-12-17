// src/context/AbilityContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { AppAbility } from './types';
import { useUser } from '../auth/auth';
import { defineAbilityFor } from './factory';

const AbilityContext = createContext<AppAbility | undefined>(undefined);

export function AbilityProvider({ children }: { children: ReactNode }) {
    const user = useUser();
    // if (!user?.data) return null;
    const ability = defineAbilityFor(user?.data);

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
}

export function useAbility() {
    const ability = useContext(AbilityContext);
    if (!ability) {
        throw new Error('useAbility must be used within AbilityProvider');
    }
    return ability;
}

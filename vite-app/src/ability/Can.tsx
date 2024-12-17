// src/components/Can.tsx
import { ReactNode } from 'react';
import { Can as CaslCan } from '@casl/react';
import { Actions, Subjects } from './types';
import { useAbility } from './AbilityContext';

interface CanProps {
    I: Actions;
    do: Subjects;
    this?: Record<string, any>;
    field?: string;
    children: ReactNode;
}

export function Can({ I, do: action, this: subject, field, children }: CanProps) {
    const ability = useAbility();

    return (
        <CaslCan
            I={I}
            do={action}
            this={subject}
            field={field}
            ability={ability}
        >
            {children}
        </CaslCan>
    );
}

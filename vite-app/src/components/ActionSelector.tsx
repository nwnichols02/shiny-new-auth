// src/components/selectors/ActionSelector.tsx
import { useState } from 'react';
import { Actions } from '../ability/types';

interface ActionSelectorProps {
    selected: Actions[];
    onChange: (actions: Actions[]) => void;
    disabled?: boolean;
}

const availableActions: Actions[] = [
    'create',
    'read',
    'update',
    'delete',
    'manage',
    'export',
    'import'
];

export function ActionSelector({ selected, onChange, disabled }: ActionSelectorProps) {
    const handleToggle = (action: Actions) => {
        const newSelected = selected.includes(action)
            ? selected.filter(a => a !== action)
            : [...selected, action];
        onChange(newSelected);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {availableActions.map(action => (
                    <div
                        key={action}
                        className={`
              px-3 py-1 rounded-full cursor-pointer text-sm
              ${selected.includes(action)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}
            `}
                        onClick={() => !disabled && handleToggle(action)}
                    >
                        {action}
                    </div>
                ))}
            </div>
            <div className="text-sm text-gray-500">
                Selected: {selected.length ? selected.join(', ') : 'None'}
            </div>
        </div>
    );
}

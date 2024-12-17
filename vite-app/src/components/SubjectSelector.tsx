// src/components/selectors/SubjectSelector.tsx
import { useState } from 'react';
import { Subjects } from '../ability/types';

interface SubjectSelectorProps {
    selected: Subjects[];
    onChange: (subjects: Subjects[]) => void;
    disabled?: boolean;
}

const availableSubjects: Subjects[] = [
    'User',
    'Role',
    'Permission',
    'Report',
    'Dashboard',
    'Settings',
    'all'
];

export function SubjectSelector({ selected, onChange, disabled }: SubjectSelectorProps) {
    const handleToggle = (subject: Subjects) => {
        if (subject === 'all') {
            onChange(['all']);
            return;
        }

        const newSelected = selected.includes(subject)
            ? selected.filter(s => s !== subject)
            : [...selected.filter(s => s !== 'all'), subject];

        onChange(newSelected);
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {availableSubjects.map(subject => (
                    <div
                        key={subject}
                        className={`
              px-3 py-1 rounded-full cursor-pointer text-sm
              ${selected.includes(subject)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-400'}
            `}
                        onClick={() => !disabled && handleToggle(subject)}
                    >
                        {subject}
                    </div>
                ))}
            </div>
        </div>
    );
}

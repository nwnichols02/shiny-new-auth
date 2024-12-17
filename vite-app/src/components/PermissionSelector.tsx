// src/components/selectors/PermissionSelector.tsx
import { useState } from 'react';
import { PermissionRule } from '../ability/types';
import { ActionSelector } from './ActionSelector';
import { SubjectSelector } from './SubjectSelector';
import { ConditionBuilder } from './ConditionSelector';

interface PermissionSelectorProps {
    value: PermissionRule[];
    onChange: (permissions: PermissionRule[]) => void;
}

export function PermissionSelector({ value, onChange }: PermissionSelectorProps) {
    const [selectedPermission, setSelectedPermission] = useState<number | null>(null);

    const addPermission = () => {
        const newPermission: PermissionRule = {
            action: 'read',
            subject: 'User',
            conditions: {},
        };
        onChange([...value, newPermission]);
    };

    const updatePermission = (index: number, updates: Partial<PermissionRule>) => {
        const newPermissions = [...value];
        newPermissions[index] = { ...newPermissions[index], ...updates };
        onChange(newPermissions);
    };

    const removePermission = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
        setSelectedPermission(null);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {value.map((permission, index) => (
                    <div
                        key={index}
                        className={`
              p-4 border rounded cursor-pointer
              ${selectedPermission === index ? 'border-blue-500' : 'border-gray-200'}
            `}
                        onClick={() => setSelectedPermission(index)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="font-medium">{permission.action}</span>
                                <span className="mx-2">→</span>
                                <span>{permission.subject}</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removePermission(index);
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>

                        {selectedPermission === index && (
                            <div className="mt-4 space-y-4">
                                <ActionSelector
                                    selected={[permission.action]}
                                    onChange={(actions) =>
                                        updatePermission(index, { action: actions[0] })
                                    }
                                />
                                <SubjectSelector
                                    selected={[permission.subject]}
                                    onChange={(subjects) =>
                                        updatePermission(index, { subject: subjects[0] })
                                    }
                                />
                                <ConditionBuilder
                                    conditions={permission.conditions || {}}
                                    onChange={(conditions) =>
                                        updatePermission(index, { conditions })
                                    }
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={addPermission}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Add Permission
            </button>
        </div>
    );
}

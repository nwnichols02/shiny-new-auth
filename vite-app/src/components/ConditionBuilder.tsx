// src/components/builders/ConditionBuilder.tsx
import { useState } from 'react';
import { RuleCondition, ConditionOperator } from '../ability/types';

interface ConditionBuilderProps {
    conditions: RuleCondition[];
    onChange: (conditions: RuleCondition[]) => void;
    availableFields?: string[];
}

const defaultFields = [
    'user.id',
    'user.role',
    'user.department',
    'resource.owner',
    'resource.type',
    'resource.status',
];

const operators: ConditionOperator[] = [
    '=', '!=', '>', '<', '>=', '<=', 'in', 'contains', 'startsWith', 'endsWith'
];

export function ConditionBuilder({
    conditions,
    onChange,
    availableFields = defaultFields,
}: ConditionBuilderProps) {
    const addCondition = () => {
        onChange([
            ...conditions,
            {
                field: availableFields[0],
                operator: '=',
                value: '',
                logic: 'AND',
            },
        ]);
    };

    const updateCondition = (index: number, updates: Partial<RuleCondition>) => {
        const newConditions = conditions.map((condition, i) =>
            i === index ? { ...condition, ...updates } : condition
        );
        onChange(newConditions);
    };

    const removeCondition = (index: number) => {
        onChange(conditions.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {conditions.map((condition, index) => (
                <div key={index} className="p-4 border rounded bg-gray-50">
                    {index > 0 && (
                        <select
                            value={condition.logic}
                            onChange={(e) => updateCondition(index, { logic: e.target.value as 'AND' | 'OR' })}
                            className="mb-2 p-2 border rounded"
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                    )}

                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-3">
                            <select
                                value={condition.field}
                                onChange={(e) => updateCondition(index, { field: e.target.value })}
                                className="w-full p-2 border rounded"
                            >
                                {availableFields.map((field) => (
                                    <option key={field} value={field}>
                                        {field}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <select
                                value={condition.operator}
                                onChange={(e) =>
                                    updateCondition(index, { operator: e.target.value as ConditionOperator })
                                }
                                className="w-full p-2 border rounded"
                            >
                                {operators.map((op) => (
                                    <option key={op} value={op}>
                                        {op}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-5">
                            {condition.operator === 'in' ? (
                                <input
                                    type="text"
                                    value={Array.isArray(condition.value) ? condition.value.join(', ') : ''}
                                    onChange={(e) =>
                                        updateCondition(index, {
                                            value: e.target.value.split(',').map(v => v.trim())
                                        })
                                    }
                                    placeholder="Comma-separated values"
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={condition.value}
                                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            )}
                        </div>

                        <div className="col-span-2">
                            <button
                                onClick={() => removeCondition(index)}
                                className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addCondition}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Condition
            </button>
        </div>
    );
}

// src/features/rules/components/RuleBuilder.tsx
import { useState } from 'react';
import { Rule } from '../ability/types';
import { ActionSelector } from './ActionSelector';
import { SubjectSelector } from './SubjectSelector';
import { ConditionBuilder } from './ConditionSelector';

interface RuleBuilderProps {
    initialRule?: Rule;
    onSave: (rule: Rule) => void;
}

export function RuleBuilder({ initialRule, onSave }: RuleBuilderProps) {
    const [rule, setRule] = useState<Partial<Rule>>(
        initialRule || {
            id: '',
            name: '',
            description: '',
            actions: [],
            subjects: [],
            conditions: [],
            isActive: true,
            priority: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    );

    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Rule Builder</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSave(rule as Rule);
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Rule Name</label>
                    <input
                        type="text"
                        value={rule.name}
                        onChange={(e) => setRule({ ...rule, name: e.target.value })}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Actions</label>
                    <ActionSelector
                        selected={rule.actions || []}
                        onChange={(actions) => setRule({ ...rule, actions })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Subjects</label>
                    <SubjectSelector
                        selected={rule.subjects || []}
                        onChange={(subjects) => setRule({ ...rule, subjects })}
                    />
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="text-blue-500"
                    >
                        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                    </button>
                </div>

                {showAdvanced && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Conditions</label>
                        <ConditionBuilder
                            conditions={rule.conditions || []}
                            onChange={(conditions) => setRule({ ...rule, conditions } as Rule)}
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Save Rule
                    </button>
                </div>
            </form>
        </div>
    );
}

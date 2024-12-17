import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Can } from '../ability/Can';
import { Actions, Subjects } from '../ability/types';
import { RuleSimulator } from '../components/RoleSimulator';
import { rulesService } from '../auth/api';
import { RuleList } from '../components/RuleList';

export const Route = createFileRoute('/rules')({
    component: RuleManagementDashboard,
})

// src/features/rules/types/rule.types.ts
interface Rule {
    id: string;
    name: string;
    description: string;
    role: string;
    actions: Actions[];
    subjects: Subjects[];
    conditions?: Record<string, any>;
    fields?: string[];
    isActive: boolean;
}

// src/features/rules/components/RuleManagementDashboard.tsx


export function RuleManagementDashboard() {
    const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
    const queryClient = useQueryClient();

    const { data: rules } = useQuery({
        queryKey: ['rules'],
        queryFn: () => rulesService.getRules()
    });

    const updateRuleMutation = useMutation({
        // mutationFn: (rule: Rule) => rulesService.updateRule(rule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        }
    });

    return (
        <div className="grid grid-cols-12 gap-4">
            {/* Hello world */}
            <Can I="read" do="Permission">
                <div className="col-span-3">
                    <RuleList
                        rules={rules || []}
                        onSelectRule={setSelectedRule || undefined}
                    />
                </div>
                <div className="col-span-6">
                    <RuleBuilder
                        selectedRule={selectedRule}
                        onSave={updateRuleMutation.mutate}
                    />
                </div>
                <div className="col-span-3">
                    <RuleSimulator rules={rules || []} />
                </div>
            </Can>
        </div>
    );
}

// src/features/rules/components/RuleBuilder.tsx
export function RuleBuilder({ selectedRule, onSave }: RuleBuilderProps) {
    const [rule, setRule] = useState<Rule>(selectedRule);

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Rule Builder</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                onSave(rule);
            }}>
                {/* Rule builder form fields */}
                <input
                    type="text"
                    value={rule?.name}
                    onChange={(e) => setRule({ ...rule, name: e.target.value })}
                />
                {/* Add more form fields for actions, subjects, conditions */}
            </form>
        </div>
    );
}

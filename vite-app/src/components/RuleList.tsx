// src/components/rules/RuleList.tsx
import { useQuery } from '@tanstack/react-query';
import { Rule } from '../ability/types';
import { rulesService } from '../auth/api';

interface RuleListProps {
    onSelectRule: (rule: Rule) => void;
    selectedRuleId?: string;
}

export function RuleList({ onSelectRule, selectedRuleId }: RuleListProps) {
    const { data: rules, isLoading } = useQuery({
        queryKey: ['rules'],
        queryFn: rulesService.getRules,
    });

    if (isLoading) {
        return <div className="p-4">Loading rules...</div>;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-lg font-medium">Rules</h3>
            </div>
            <div className="divide-y">
                {rules?.map((rule) => (
                    <div
                        key={rule.id}
                        className={`
              p-4 cursor-pointer hover:bg-gray-50 transition
              ${selectedRuleId === rule.id ? 'bg-blue-50' : ''}
            `}
                        onClick={() => onSelectRule(rule)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">{rule.name}</h4>
                                <p className="text-sm text-gray-500">{rule.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`
                    px-2 py-1 rounded-full text-xs
                    ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}
                                >
                                    {rule.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Priority: {rule.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

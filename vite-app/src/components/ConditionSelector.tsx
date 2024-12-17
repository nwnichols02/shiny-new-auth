// src/components/builders/ConditionBuilder.tsx
import { useState } from 'react';

interface ConditionBuilderProps {
    conditions: Record<string, any>;
    onChange: (conditions: Record<string, any>) => void;
}

type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';

interface Condition {
    field: string;
    operator: Operator;
    value: string;
}

export function ConditionBuilder({ conditions, onChange }: ConditionBuilderProps) {
    const [conditionList, setConditionList] = useState<Condition[]>(
        Object.entries(conditions).map(([field, value]) => ({
            field,
            operator: '=',
            value: String(value)
        }))
    );

    const updateConditions = (newConditionList: Condition[]) => {
        setConditionList(newConditionList);
        const newConditions = newConditionList.reduce((acc, condition) => ({
            ...acc,
            [condition.field]: condition.value
        }), {});
        onChange(newConditions);
    };

    const addCondition = () => {
        updateConditions([...conditionList, { field: '', operator: '=', value: '' }]);
    };

    const removeCondition = (index: number) => {
        const newList = conditionList.filter((_, i) => i !== index);
        updateConditions(newList);
    };

    return (
        <div className="space-y-4">
            {conditionList.map((condition, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Field"
                        value={condition.field}
                        onChange={(e) => {
                            const newList = [...conditionList];
                            newList[index].field = e.target.value;
                            updateConditions(newList);
                        }}
                        className="border rounded p-2"
                    />
                    <select
                        value={condition.operator}
                        onChange={(e) => {
                            const newList = [...conditionList];
                            newList[index].operator = e.target.value as Operator;
                            updateConditions(newList);
                        }}
                        className="border rounded p-2"
                    >
                        <option value="=">=</option>
                        <option value="!=">!=</option>
                        <option value="in">in</option>
                        <option value="contains">contains</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Value"
                        value={condition.value}
                        onChange={(e) => {
                            const newList = [...conditionList];
                            newList[index].value = e.target.value;
                            updateConditions(newList);
                        }}
                        className="border rounded p-2"
                    />
                    <button
                        onClick={() => removeCondition(index)}
                        className="text-red-500 hover:text-red-700"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                onClick={addCondition}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Add Condition
            </button>
        </div>
    );
}

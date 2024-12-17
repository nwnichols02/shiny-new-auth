// src/features/rules/components/RuleSimulator.tsx
import { useState } from 'react';
import { User } from '../auth/types';
import { Actions, Rule, Subjects } from '../ability/types'
import { defineAbilityFor } from '../ability/factory';

interface RuleSimulatorProps {
    rules: Rule[];
}

export function RuleSimulator({ rules }: RuleSimulatorProps) {
    const [testUser, setTestUser] = useState<Partial<User>>({
        id: '',
        roles: [],
    });

    const [testAction, setTestAction] = useState('');
    const [testSubject, setTestSubject] = useState('');

    const simulatePermission = () => {
        const ability = defineAbilityFor(testUser as User);
        return ability.can(testAction as Actions, testSubject as Subjects);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Rule Simulator</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Test User</label>
                    <select
                        value={testUser.roles?.[0]}
                        onChange={(e) =>
                            setTestUser({ ...testUser, roles: [e.target.value] })
                        }
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Role</option>
                        {/* Add role options */}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Action</label>
                    <select
                        value={testAction}
                        onChange={(e) => setTestAction(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Action</option>
                        <option value="create">Create</option>
                        <option value="read">Read</option>
                        <option value="update">Update</option>
                        <option value="delete">Delete</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <select
                        value={testSubject}
                        onChange={(e) => setTestSubject(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Subject</option>
                        <option value="User">User</option>
                        <option value="Role">Role</option>
                        <option value="Permission">Permission</option>
                    </select>
                </div>

                <div className="mt-4">
                    <button
                        onClick={() => simulatePermission()}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Test Permission
                    </button>
                </div>

                <div className="mt-4">
                    <h3 className="font-medium">Result:</h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded">
                        {simulatePermission() ? (
                            <span className="text-green-500">✓ Permission Granted</span>
                        ) : (
                            <span className="text-red-500">✗ Permission Denied</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

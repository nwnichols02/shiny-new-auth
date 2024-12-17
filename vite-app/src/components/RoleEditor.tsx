// src/features/roles/components/RoleEditor.tsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Role } from '../auth/types';
import { rolesService } from '../auth/api';
import { PermissionSelector } from './PermissionSelector';

interface RoleEditorProps {
    selectedRole?: Role;
    onClose: () => void;
}

export function RoleEditor({ selectedRole, onClose }: RoleEditorProps) {
    const queryClient = useQueryClient();
    const [role, setRole] = useState<Partial<Role>>({
        name: '',
        description: '',
        permissions: [],
        parentRole: undefined,
    });

    useEffect(() => {
        if (selectedRole) {
            setRole(selectedRole);
        }
    }, [selectedRole]);

    const mutation = useMutation({
        mutationFn: (roleData: Role) => {
            return selectedRole
                ? rolesService.updateRole(roleData)
                : rolesService.createRole(roleData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            onClose();
        },
    });

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
                {selectedRole ? 'Edit Role' : 'Create Role'}
            </h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate(role as Role);
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={role.name}
                        onChange={(e) => setRole({ ...role, name: e.target.value })}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        value={role.description}
                        onChange={(e) => setRole({ ...role, description: e.target.value })}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Permissions</label>
                    <PermissionSelector
                        value={role.permissions || []}
                        onChange={(permissions: any) => setRole({ ...role, permissions })}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// src/features/roles/components/RoleList.tsx
import { useQuery } from '@tanstack/react-query';
import { rolesService } from '../auth/api';
import { Role } from '../auth/types';

interface RoleListProps {
    onSelectRole: (role: Role) => void;
}

export function RoleList({ onSelectRole }: RoleListProps) {
    const { data: roles, isLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: rolesService.getRoles,
    });

    if (isLoading) {
        return <div className="p-4">Loading roles...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Roles</h2>
            </div>
            <div className="divide-y">
                {roles?.map((role) => (
                    <div
                        key={role.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition"
                        onClick={() => onSelectRole(role)}
                    >
                        <h3 className="font-medium">{role.name}</h3>
                        <p className="text-sm text-gray-500">{role.description}</p>
                        {role.parentRole && (
                            <span className="text-xs text-gray-400">
                                Parent: {roles.find(r => r.id === role.parentRole)?.name}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

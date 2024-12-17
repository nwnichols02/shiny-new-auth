import { createFileRoute } from '@tanstack/react-router'
// src/features/roles/components/RoleHierarchyView.tsx
import { PermissionRule } from '../ability/types';
import { useQuery } from '@tanstack/react-query';
import { Can } from '../ability/Can';
import { RoleList } from '../components/RoleList';
import { RoleEditor } from '../components/RoleEditor';
import { rolesService } from '../auth/api';
import { Tree, TreeNode } from '../components/Tree';

export const Route = createFileRoute('/roles')({
    component: RoleManagement,
})

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: PermissionRule[];
    parentRole?: string;
}

// src/features/roles/components/RoleManagement.tsx
export function RoleManagement() {
    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: () => rolesService.getRoles()
    });

    return (
        <div className="grid grid-cols-12 gap-4">
            {/* <Can I="manage" do="Role"> */}
            <div className="col-span-4">
                <RoleList roles={roles || []} onSelectRole={() => { }} />
            </div>
            <div className="col-span-8">
                <RoleEditor selectedRole={roles && roles[0]} onClose={() => { }} />
            </div>
            {/* </Can> */}
        </div>
    );
}



export function RoleHierarchyView({ roles }: { roles: Role[] }) {
    const buildHierarchy = (roles: Role[]): TreeNode[] => {
        // Convert flat role list to hierarchical structure
        return roles.map(role => ({
            id: role.id,
            label: role.name,
            children: roles
                .filter(r => r.parentRole === role.id)
                .map(child => buildHierarchy([child]))
                .flat()
        }));
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Role Hierarchy</h3>
            <Tree nodes={buildHierarchy(roles)} />
        </div>
    );
}
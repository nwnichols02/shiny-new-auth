import { createFileRoute } from '@tanstack/react-router'
import { Actions, Subjects } from '../ability/types';
import { usePermission } from '../ability/usePermission';
import { useMutation, useQuery } from '@tanstack/react-query';
import { permissionsService } from '../auth/api';
import { PermissionCell } from '../components/PermissionCell';

export const Route = createFileRoute('/permission')({
    component: PermissionMatrix,
})

interface MatrixCell {
    roleId: string;
    subjectId: string;
    actions: Actions[];
}


export const subjects: Subjects[] = [
    'User',
    'Role',
    'Permission',
    'Report',
    'Dashboard',
    'Settings',
    'all'
];

export function PermissionMatrix() {
    const { can } = usePermission();
    const { data: matrix } = useQuery({
        queryKey: ['permissionMatrix'],
        queryFn: () => permissionsService.getPermissionMatrix(),
    });

    const updatePermissionMutation = useMutation({
        mutationFn: (cell: MatrixCell) => permissionsService.updatePermission(cell.roleId, cell.subjectId, cell.actions)
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th>Role / Resource</th>
                        {subjects?.map((subject: any) => (
                            <th key={subject}>{subject}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* {matrix && matrix?.map((row: any) => (
                        <tr key={row.roleId}>
                            <td>{row.roleName}</td>
                            {row.permissions.map((cell: any) => (
                                <td key={`${row.roleId}-${cell.subjectId}`}>
                                    <PermissionCell
                                        roleId={row.roleId}
                                        subjectId={cell.subjectId}
                                        actions={cell.actions}
                                        onChange={updatePermissionMutation.mutate()}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))} */}
                    {matrix?.map((row) => (
                        <tr key={row.roleId}>
                            <td className="px-4 py-2 font-medium border-b">
                                {row.roleName}
                            </td>
                            {subjects.map((subject) => (
                                <td
                                    key={`${row.roleId}-${subject}`}
                                    className="px-4 py-2 border-b"
                                >
                                    <PermissionCell
                                        roleId={row.roleId}
                                        subjectId={subject}
                                        actions={row.permissions.find(
                                            p => p.subjectId === subject
                                        )?.actions || []}
                                        onChange={(actions) => handlePermissionChange(
                                            row.roleId,
                                            subject,
                                            actions
                                        )}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
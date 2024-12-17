import { useState } from "react";
import { Actions } from "../ability/types";
import { permissionsService } from "../auth/api";
import { ActionSelector } from "./ActionSelector";

interface PermissionCellProps {
    roleId: string;
    subjectId: string;
    actions: Actions[];
    onChange: (actions: Actions[]) => void;
}

export function PermissionCell({
    roleId,
    subjectId,
    actions,
    onChange,
}: PermissionCellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedActions, setSelectedActions] = useState(actions);

    const handleSave = async () => {
        try {
            await permissionsService.updatePermission(roleId, subjectId, selectedActions);
            onChange(selectedActions);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update permissions:', error);
        }
    };

    if (!isEditing) {
        return (
            <div
                onClick={() => setIsEditing(true)}
                className="p-2 cursor-pointer hover:bg-gray-50"
            >
                {actions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {actions.map((action) => (
                            <span
                                key={action}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                                {action}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400">No permissions</span>
                )}
            </div>
        );
    }

    return (
        <div className="p-2 bg-white shadow rounded">
            <ActionSelector
                selected={selectedActions}
                onChange={setSelectedActions}
            />
            <div className="mt-2 flex justify-end space-x-2">
                <button
                    onClick={() => setIsEditing(false)}
                    className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
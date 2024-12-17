import React, { useState, useCallback } from 'react';

export interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
    data?: Record<string, any>;
    isExpanded?: boolean;
    isSelected?: boolean;
    icon?: React.ReactNode;
}

export interface TreeProps {
    nodes: TreeNode[];
    onNodeSelect?: (node: TreeNode) => void;
    onNodeToggle?: (node: TreeNode) => void;
    selectedNodeId?: string;
    className?: string;
    showLines?: boolean;
    isDraggable?: boolean;
    isSearchable?: boolean;
}

// src/common/components/Tree/Tree.tsx


export function Tree({
    nodes,
    onNodeSelect,
    onNodeToggle,
    selectedNodeId,
    className = '',
    showLines = true,
    isDraggable = false,
    isSearchable = false
}: TreeProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const handleNodeToggle = useCallback((node: TreeNode) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(node.id)) {
                next.delete(node.id);
            } else {
                next.add(node.id);
            }
            return next;
        });
        onNodeToggle?.(node);
    }, [onNodeToggle]);

    const filteredNodes = searchTerm
        ? filterNodes(nodes, searchTerm.toLowerCase())
        : nodes;

    return (
        <div className={`tree-container ${className}`}>
            {isSearchable && (
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="mb-2"
                />
            )}

            <div className="tree-content">
                {filteredNodes.map((node, index) => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        level={0}
                        isLast={index === filteredNodes.length - 1}
                        onSelect={onNodeSelect}
                        onToggle={handleNodeToggle}
                        isExpanded={expandedNodes.has(node.id)}
                        isSelected={node.id === selectedNodeId}
                        showLines={showLines}
                        isDraggable={isDraggable}
                    />
                ))}
            </div>
        </div>
    );
}

interface TreeNodeProps {
    node: TreeNode;
    level: number;
    isLast: boolean;
    onSelect?: (node: TreeNode) => void;
    onToggle?: (node: TreeNode) => void;
    isExpanded: boolean;
    isSelected: boolean;
    showLines: boolean;
    isDraggable: boolean;
}

export function TreeNode({
    node,
    level,
    isLast,
    onSelect,
    onToggle,
    isExpanded,
    isSelected,
    showLines,
    isDraggable
}: TreeNodeProps) {
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = `${level * 20}px`;

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(node);
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle?.(node);
    };

    return (
        <div className="tree-node-container">
            <div
                className={`
          tree-node
          ${isSelected ? 'selected' : ''}
          ${isDraggable ? 'draggable' : ''}
        `}
                style={{ paddingLeft }}
                onClick={handleSelect}
                draggable={isDraggable}
            >
                <div className="tree-node-content">
                    {hasChildren && (
                        <button
                            className="toggle-button"
                            onClick={handleToggle}
                        >
                            {isExpanded}
                            {/* {isExpanded ? <ChevronDown /> : <ChevronRight />} */}
                        </button>
                    )}

                    {node.icon && (
                        <span className="node-icon">{node.icon}</span>
                    )}

                    <span className="node-label">{node.label}</span>
                </div>

                {showLines && !isLast && (
                    <div className="tree-line" />
                )}
            </div>

            {hasChildren && isExpanded && (
                <div className="tree-node-children">
                    {node.children!.map((childNode: any, index: number) => (
                        <TreeNode
                            key={childNode.id}
                            node={childNode}
                            level={level + 1}
                            isLast={index === node.children!.length - 1}
                            onSelect={onSelect}
                            onToggle={onToggle}
                            isExpanded={isExpanded}
                            isSelected={isSelected}
                            showLines={showLines}
                            isDraggable={isDraggable}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// src/common/components/Tree/SearchBar.tsx

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SearchBar({ value, onChange, className = '' }: SearchBarProps) {
    return (
        <div className={`search-bar-container ${className}`}>
            {/* <SearchIcon className="search-icon" /> */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search..."
                className="search-input"
            />
        </div>
    );
}


export function filterNodes(nodes: TreeNode[], searchTerm: string): TreeNode[] {
    return nodes.reduce<TreeNode[]>((filtered, node) => {
        const matchesSearch = node.label.toLowerCase().includes(searchTerm);

        if (node.children && node.children.length > 0) {
            const filteredChildren = filterNodes(node.children, searchTerm);
            if (matchesSearch || filteredChildren.length > 0) {
                filtered.push({
                    ...node,
                    children: filteredChildren,
                });
            }
        } else if (matchesSearch) {
            filtered.push(node);
        }

        return filtered;
    }, []);
}

export function flattenNodes(nodes: TreeNode[]): TreeNode[] {
    return nodes.reduce<TreeNode[]>((flattened, node) => {
        flattened.push(node);
        if (node.children && node.children.length > 0) {
            flattened.push(...flattenNodes(node.children));
        }
        return flattened;
    }, []);
}

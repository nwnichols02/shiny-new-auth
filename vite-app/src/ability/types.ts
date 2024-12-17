// src/types/ability.types.ts
import { AbilityBuilder, Ability, Subject } from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'| 'export' | 'import';
export type Subjects = 
| 'User'
| 'Role'
| 'Permission'
| 'Report'
| 'Dashboard'
| 'Settings'
| 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

export interface PermissionRule {
    action: Actions;
    subject: Subjects;
    conditions?: Record<string, any>;
    fields?: string[];
    inverted?: boolean; // For explicitly denying permissions
  }

  export interface Rule {
    id: string;
    name: string;
    description: string;
    conditions: RuleCondition[];
    actions: Actions[];
    subjects: Subjects[];
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface RuleCondition {
    field: string;
    operator: ConditionOperator;
    value: any;
    logic: 'AND' | 'OR';
  }
  
  export type ConditionOperator = 
    | '=' 
    | '!=' 
    | '>' 
    | '<' 
    | '>=' 
    | '<=' 
    | 'in' 
    | 'contains'
    | 'startsWith'
    | 'endsWith';
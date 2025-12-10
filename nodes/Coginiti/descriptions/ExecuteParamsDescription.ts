import type { INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export const scriptJson: INodeProperties[] = [
	// ----------------------------------------
	// Parameters: JSON Mode
	// ----------------------------------------
	{
		displayName: 'Parameters',
		name: 'paramsScriptJson',
		type: 'json' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeScript'],
				modeParams: ['json'],
			},
		},
		typeOptions: {
			alwaysOpenEditWindow: false,
			rows: 10,
		},
		default: '{}',
		description: 'Parameters to pass into the script. Must be valid JSON.',
		validateType: 'object',
		ignoreValidationDuringExecution: true
	},
];

export const blockJson: INodeProperties[] = [
	// ----------------------------------------
	// Parameters: JSON Mode
	// ----------------------------------------
	{
		displayName: 'Parameters',
		name: 'paramsBlockJson',
		type: 'json' as NodePropertyTypes,
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
				modeParams: ['json'],
			},
		},
		typeOptions: {
			alwaysOpenEditWindow: false,
			rows: 10,
		},
		default: '{}',
		description: 'Parameters to pass into the script. Must be valid JSON.',
		validateType: 'object',
		ignoreValidationDuringExecution: true
	},
];

export const scriptManual: INodeProperties[] = [
	// ----------------------------------------
	// Parameters: Manual Mode
	// ----------------------------------------
	{
		displayName: 'Parameters',
		name: 'paramsScriptManual',
		type: 'assignmentCollection',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeScript'],
				modeParams: ['manual'],
			},
		},
		default: {},
		description: 'Parameters to pass into the block/script',
	},

];

export const blockManual: INodeProperties[] = [
	// ----------------------------------------
	// Parameters: Manual Mode
	// ----------------------------------------
	{
		displayName: 'Parameters',
		name: 'paramsBlockManual',
		type: 'assignmentCollection',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
				modeParams: ['manual'],
			},
		},
		default: {},
		description: 'Parameters to pass into the block/script',
	}
];

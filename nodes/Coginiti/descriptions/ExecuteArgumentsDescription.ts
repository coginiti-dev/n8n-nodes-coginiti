import type { INodeProperties } from 'n8n-workflow';

export const blockJson: INodeProperties[] = [
	// ----------------------------------------
	// Arguments: JSON Mode (only for executeBlock)
	// ----------------------------------------
	{
		displayName: 'Arguments',
		name: 'argumentsBlockJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
				modeArguments: ['json'],
			},
		},
		typeOptions: {
			alwaysOpenEditWindow: false,
			rows: 10,
		},
		default: '{}',
		description: 'Arguments to pass to the block. Must be valid JSON.',
		validateType: 'object',
		ignoreValidationDuringExecution: true
	},
];

export const scriptJson: INodeProperties[] = [
	// ----------------------------------------
	// Arguments: Manual Mode (only for executeBlock)
	// ----------------------------------------
	{
		displayName: 'Arguments',
		name: 'argumentsBlockManual',
		type: 'assignmentCollection',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
				modeArguments: ['manual'],
			},
		},
		default: {},
		description: 'Arguments to pass to the block',
	},
];

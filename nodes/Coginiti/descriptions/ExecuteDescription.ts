import type { INodeProperties } from 'n8n-workflow';
import * as executeArgumentsDescriptions from './ExecuteArgumentsDescription';
import * as executeParamsDescritions from './ExecuteParamsDescription';

export type ExecuteMode = 'manual' | 'json';

export const executeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['execute'],
			},
		},
		options: [
			{
				name: 'Execute Block',
				value: 'executeBlock',
				description: 'Execute a CoginitiScript block',
				action: 'Execute block',
			},
			{
				name: 'Execute Script',
				value: 'executeScript',
				description: 'Execute a SQL script from catalog',
				action: 'Execute script',
			},
		],
		default: 'executeScript',
	},
];

export const executeFields: INodeProperties[] = [
	// ----------------------------------------
	// execute: executeScript
	// ----------------------------------------
	{
		displayName: 'Path',
		name: 'executePath',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeScript'],
			},
		},
		default: '',
		required: true,
		placeholder: '@Personal/Reports/performance',
		description: 'Absolute path to the catalog asset',
	},

	// ----------------------------------------
	// execute: executeBlock
	// ----------------------------------------
	{
		displayName: 'Package',
		name: 'package',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
			},
		},
		default: '',
		required: true,
		placeholder: '@Personal/My Projects/demo/customers',
		description: 'Absolute path to the CoginitiScript package',
	},
	{
		displayName: 'Block Name',
		name: 'blockName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
			},
		},
		default: '',
		required: true,
		placeholder: 'CustomersWithEmailDomain',
		description: 'Name of the block to execute',
	},

	// ----------------------------------------
	// execute: common fields
	// ----------------------------------------
	{
		displayName: 'Connection Name',
		name: 'connectionName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['execute'],
			},
		},
		default: '',
		required: true,
		placeholder: 'My Connection',
		description: 'Name of the database connection',
	},

	// ----------------------------------------
	// Parameters Mode Selector
	// ----------------------------------------
	{
		displayName: 'Parameters Mode',
		name: 'modeParams',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeScript', 'executeBlock'],
			},
		},
		options: [
			{
				name: 'Manual',
				value: 'manual',
				description: 'Add parameters one by one',
			},
			{
				name: 'JSON',
				value: 'json',
				description: 'Provide parameters as JSON object',
			},
		],
		default: 'manual',
		description: 'How to specify parameters',
	},

	// ----------------------------------------
	// Parameters Mode
	// ----------------------------------------
	...executeParamsDescritions.blockJson,
	...executeParamsDescritions.blockManual,
	...executeParamsDescritions.scriptJson,
	...executeParamsDescritions.scriptManual,


	// ----------------------------------------
	// Arguments Mode (only for executeBlock)
	// ----------------------------------------
	{
		displayName: 'Arguments Mode',
		name: 'modeArguments',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeBlock'],
			},
		},
		options: [
			{
				name: 'Manual',
				value: 'manual',
				description: 'Add arguments one by one',
			},
			{
				name: 'JSON',
				value: 'json',
				description: 'Provide arguments as JSON object',
			},
		],
		default: 'manual',
		description: 'How to specify arguments',
	},

	...executeArgumentsDescriptions.blockJson,
	...executeArgumentsDescriptions.scriptJson,

	// ----------------------------------------
	// Other fields
	// ----------------------------------------
	{
		displayName: 'Response Format',
		name: 'responseFormat',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['execute'],
				operation: ['executeScript', 'executeBlock'],
			},
		},
		options: [
			{ name: 'JSON', value: 'application/json' },
			{ name: 'CSV', value: 'text/csv' },
			{ name: 'Apache Arrow', value: 'application/vnd.apache.arrow.stream' },
		],
		default: 'application/json',
		description: 'Format for the response data',
	},
	{
		displayName: 'Project Version',
		name: 'projectVersion',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['execute'],
			},
		},
		default: '',
		placeholder: 'e.g. 2.0.0',
		description: 'For @Project Hub assets only. If not provided, the latest version will be used.',
	},
];

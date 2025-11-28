import type { INodeProperties } from 'n8n-workflow';

export const groupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new group',
				action: 'Create group',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a group',
				action: 'Delete group',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a group by ID',
				action: 'Get group',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all groups',
				action: 'List groups',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a group',
				action: 'Update group',
			},
		],
		default: 'list',
	},
];

export const groupFields: INodeProperties[] = [
	// ----------------------------------------
	// group: get, update, delete
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'resourceId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the group',
	},

	// ----------------------------------------
	// group: list
	// ----------------------------------------
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['list'],
			},
		},
		default: 50,
		description: 'Maximum number of results to return',
	},
	{
		displayName: 'Start Index',
		name: 'startIndex',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['list'],
			},
		},
		default: 1,
		description: '1-based index of the first result',
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['list'],
			},
		},
		default: '',
		placeholder: 'displayName eq "Administrators"',
		description: 'SCIM filter expression',
	},

	// ----------------------------------------
	// group: create, update
	// ----------------------------------------
	{
		displayName: 'Data',
		name: 'resourceData',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['create', 'update'],
			},
		},
		typeOptions: {
			alwaysOpenEditWindow: false,
			rows: 10,
		},
		default: '{}',
		required: true,
		description: 'Group data in SCIM format. Must be valid JSON.',
	},
];

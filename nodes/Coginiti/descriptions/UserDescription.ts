import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create user',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user',
				action: 'Delete user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get user',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all users',
				action: 'List users',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user',
				action: 'Update user',
			},
		],
		default: 'list',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------------
	// user: get, update, delete
	// ----------------------------------------
	{
		displayName: 'ID',
		name: 'resourceId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the user',
	},

	// ----------------------------------------
	// user: list
	// ----------------------------------------
	{
		displayName: 'Count',
		name: 'count',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['user'],
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
				resource: ['user'],
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
				resource: ['user'],
				operation: ['list'],
			},
		},
		default: '',
		placeholder: 'userName eq "john.doe@example.com"',
		description: 'SCIM filter expression',
	},

	// ----------------------------------------
	// user: create, update
	// ----------------------------------------
	{
		displayName: 'Data',
		name: 'resourceData',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create', 'update'],
			},
		},
		typeOptions: {
			alwaysOpenEditWindow: false,
			rows: 10,
		},
		default: '{}',
		required: true,
		description: 'User data in SCIM format. Must be valid JSON.',
	},
];

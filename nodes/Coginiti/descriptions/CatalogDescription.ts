import type { INodeProperties } from 'n8n-workflow';

export const catalogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: ['catalog'],
			},
		},
		options: [
			{
				name: 'Get Asset',
				value: 'getAsset',
				description: 'Get a single asset by path',
				action: 'Get asset by path',
			},
			{
				name: 'List Assets',
				value: 'listAssets',
				description: 'List catalog assets by given path',
				action: 'List catalog assets',
			},
		],
		default: 'listAssets',
	},
];

export const catalogFields: INodeProperties[] = [
	// ----------------------------------------
	// catalog: listAssets, getAsset
	// ----------------------------------------
	{
		displayName: 'Path',
		name: 'catalogPath',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
			},
		},
		default: '',
		required: true,
		placeholder: '@Personal/Reports/Sample Project',
		description: 'Path of the asset/folder',
	},
	{
		displayName: 'Project Version',
		name: 'projectVersion',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['catalog'],
			},
		},
		default: '',
		placeholder: 'e.g. 2.0.0',
		description: 'For @Project Hub assets only. If not provided, the latest version will be used.',
	},
];
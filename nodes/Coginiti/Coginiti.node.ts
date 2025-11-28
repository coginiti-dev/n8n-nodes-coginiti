import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	catalogOperations,
	catalogFields,
	executeOperations,
	executeFields,
	userOperations,
	userFields,
	groupOperations,
	groupFields,
} from './descriptions';

import * as handlers from './handlers';

export class Coginiti implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Coginiti',
		name: 'coginiti',
		icon: 'file:coginiti.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with Coginiti API (Catalog, Execute, Identity Management)',
		defaults: {
			name: 'Coginiti',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'coginitiApi',
				required: true,
			},
		],
		properties: [
			// ==========================================
			// LEVEL 1: RESOURCE
			// ==========================================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Catalog',
						value: 'catalog',
						description: 'Browse catalog assets',
					},
					{
						name: 'Execute',
						value: 'execute',
						description: 'Execute scripts, blocks, and tests',
					},
					{
						name: 'Group',
						value: 'group',
						description: 'Manage groups',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage users',
					},
				],
				default: 'execute',
			},

			// ==========================================
			// LEVEL 2: OPERATIONS (imported from descriptions)
			// ==========================================
			...catalogOperations,
			...executeOperations,
			...userOperations,
			...groupOperations,

			// ==========================================
			// LEVEL 3: FIELDS (imported from descriptions)
			// ==========================================
			...catalogFields,
			...executeFields,
			...userFields,
			...groupFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get common parameters once per batch
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {
				let newItem: INodeExecutionData;

				// Delegate to appropriate handler based on resource
				if (resource === 'catalog') {
					newItem = await handlers.catalog.execute.call(this, items[i], i, operation);
				} else if (resource === 'execute') {
					newItem = await handlers.execute.execute.call(this, items[i], i, operation);
				} else if (resource === 'user' || resource === 'group') {
					newItem = await handlers.scim.execute.call(this, items[i], i, operation);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown resource: ${resource}`,
						{ itemIndex: i },
					);
				}

				returnData.push(newItem);
			} catch (error) {
				// Improved error handling
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: {
							error: errorMessage,
							resource,
							operation,
							itemIndex: i,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : new Error(String(error)),
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}
}

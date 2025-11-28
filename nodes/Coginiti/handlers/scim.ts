import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, INodeExecutionData } from 'n8n-workflow';
import { buildScimListQuery, parseJsonParameter, coginitiApiRequest } from '../GenericFunctions';

/**
 * Handle SCIM operations (user and group management)
 * Extracts own parameters and returns ready INodeExecutionData
 */
export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	itemIndex: number,
	operation: string,
): Promise<INodeExecutionData> {
	// Extract resource parameter directly
	const resource = this.getNodeParameter('resource', 0) as 'user' | 'group';

	let endpoint = ''; // No /api/v1 prefix - added by coginitiApiRequest

	// Determine base endpoint based on resource type
	if (resource === 'user') {
		endpoint = '/scim/v2/Users';
	} else {
		endpoint = '/scim/v2/Groups';
	}

	let method: IHttpRequestMethods = 'GET';
	let body: IDataObject | undefined = undefined;
	const query: IDataObject = {};

	// Handle different operations - extract parameters here
	if (operation === 'list') {
		const count = this.getNodeParameter('count', itemIndex, 50) as number;
		const startIndex = this.getNodeParameter('startIndex', itemIndex, 1) as number;
		const filter = this.getNodeParameter('filter', itemIndex, '') as string;

		Object.assign(query, buildScimListQuery(count, startIndex, filter));
		method = 'GET';
	} else if (operation === 'create') {
		const dataStr = this.getNodeParameter('resourceData', itemIndex) as string;
		body = parseJsonParameter(this, dataStr, 'resourceData');
		method = 'POST';
	} else if (operation === 'get' || operation === 'update' || operation === 'delete') {
		// Operations that require resourceId
		const resourceId = this.getNodeParameter('resourceId', itemIndex) as string;
		endpoint = `${endpoint}/${resourceId}`;

		if (operation === 'get') {
			method = 'GET';
		} else if (operation === 'delete') {
			method = 'DELETE';
		} else if (operation === 'update') {
			const dataStr = this.getNodeParameter('resourceData', itemIndex) as string;
			body = parseJsonParameter(this, dataStr, 'resourceData');
			method = 'PUT';
		}
	}

	// Make API request using centralized wrapper
	const response = await coginitiApiRequest.call(this, method, endpoint, body, query);

	// Return ready INodeExecutionData
	const responseData = response || { success: true };
	return {
		json: responseData,
		pairedItem: { item: itemIndex },
	};
}

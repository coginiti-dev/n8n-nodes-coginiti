import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { buildProjectVersionQuery, coginitiApiRequest } from '../GenericFunctions';

/**
 * Handle catalog operations (listAssets, getAsset)
 * Extracts own parameters and returns ready INodeExecutionData
 */
export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	itemIndex: number,
	operation: string,
): Promise<INodeExecutionData> {
	// Extract parameters directly
	const catalogPath = this.getNodeParameter('catalogPath', itemIndex) as string;
	const projectVersion = this.getNodeParameter('projectVersion', itemIndex, '') as string;

	const query = buildProjectVersionQuery(projectVersion);

	let endpoint = '';

	// Determine endpoint based on operation (no /api/v1 prefix - added by coginitiApiRequest)
	if (operation === 'listAssets') {
		endpoint = `/catalog/list/${catalogPath}`;
	} else if (operation === 'getAsset') {
		endpoint = `/catalog/by-path/${catalogPath}`;
	}

	// Make API request using centralized wrapper
	const response = await coginitiApiRequest.call(this, 'GET', endpoint, undefined, query);

	// Return ready INodeExecutionData
	const responseData = response || {};
	return {
		json: responseData,
		pairedItem: { item: itemIndex },
	};
}

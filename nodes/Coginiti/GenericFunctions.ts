import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * Base API version path - centralized for easy upgrades
 * Change this one line to upgrade to v2: const API_BASE_VERSION = '/api/v2';
 */
const API_BASE_VERSION = '/api/v1';

/**
 * Make an authenticated API request to Coginiti
 * Automatically prepends API_BASE_VERSION to endpoint
 *
 * @param endpoint - Relative endpoint path (e.g., '/catalog/list/path' or '/exec/script')
 */
export async function coginitiApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject | string,
	qs?: IDataObject,
	option: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('coginitiApi');
	const hostname = credentials.hostname as string;

	const options: IHttpRequestOptions = {
		method,
		url: `${hostname}${API_BASE_VERSION}${endpoint}`,
		headers: {
			'user-agent': 'n8n',
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
		body,
		json: true,
		...option,
	};

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'coginitiApi', options);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), error as Error);
	}
}

/**
 * Parse JSON parameter safely
 */
export function parseJsonParameter(
	context: IExecuteFunctions,
	paramValue: string,
	paramName: string,
): JsonObject {
	try {
		return JSON.parse(paramValue);
	} catch (error) {
		throw new NodeOperationError(
			context.getNode(),
			`Invalid JSON in ${paramName}: ${(error as Error).message}`,
		);
	}
}

/**
 * Build query parameters for project version
 */
export function buildProjectVersionQuery(projectVersion: string): IDataObject {
	const query: IDataObject = {};
	if (projectVersion && projectVersion.length > 0) {
		query.project_version = projectVersion;
	}
	return query;
}

/**
 * Build SCIM list query parameters
 */
export function buildScimListQuery(
	count: number,
	startIndex: number,
	filter?: string,
): IDataObject {
	const query: IDataObject = {
		count: count.toString(),
		startIndex: startIndex.toString(),
	};

	if (filter) {
		query.filter = filter;
	}

	return query;
}

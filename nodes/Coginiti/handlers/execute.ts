import type {
	AssignmentCollectionValue,
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseJsonParameter, coginitiApiRequest } from '../GenericFunctions';
import type { ExecuteMode } from '../descriptions/ExecuteDescription';

/**
 * Convert manual mode assignmentCollection to object
 */
function convertAssignmentCollectionToObject(
	assignmentCollection: AssignmentCollectionValue,
): IDataObject {
	const result: IDataObject = {};

	// assignmentCollection structure: { assignments: [ { name, type, value } ] }
	for (const assignment of assignmentCollection?.assignments ?? []) {
		result[assignment.name] = assignment.value;
	}

	return result;
}

/**
 * Handle execute operations (executeScript, executeBlock)
 * Extracts own parameters and returns ready INodeExecutionData
 */
export async function execute(
	this: IExecuteFunctions,
	_item: INodeExecutionData,
	itemIndex: number,
	operation: string,
): Promise<INodeExecutionData> {
	// Extract common parameters
	const connectionName = this.getNodeParameter('connectionName', itemIndex) as string;
	const projectVersion = this.getNodeParameter('projectVersion', itemIndex, '') as string;
	const responseFormat = this.getNodeParameter(
		'responseFormat',
		itemIndex,
		'application/json',
	) as string;

	let endpoint = '/exec'; // No /api/v1 prefix - added by coginitiApiRequest

	const body: IDataObject = {
		connection: { name: connectionName },
	};

	if (projectVersion) {
		body.project_version = projectVersion;
	}

	// Build request based on operation - extract parameters here
	if (operation === 'executeScript') {
		endpoint = `${endpoint}/script`;
		body.path = this.getNodeParameter('executePath', itemIndex) as string;

		// Handle parameters mode
		const modeParams = this.getNodeParameter('modeParams', itemIndex, 'manual') as ExecuteMode;
		if (modeParams === 'manual') {
			const assignmentCollection = this.getNodeParameter(
				'paramsScriptManual',
				itemIndex,
				{},
			) as AssignmentCollectionValue;
			body.params = convertAssignmentCollectionToObject(assignmentCollection);
		} else {
			const params = this.getNodeParameter('paramsScriptJson', itemIndex, '{}') as string;
			body.params = parseJsonParameter(this, params, 'Parameters');
		}
	} else if (operation === 'executeBlock') {
		endpoint = `${endpoint}/block`;
		body.package = this.getNodeParameter('package', itemIndex) as string;
		body.block_name = this.getNodeParameter('blockName', itemIndex) as string;

		// Handle parameters mode
		const modeParams = this.getNodeParameter('modeParams', itemIndex, 'manual') as string;
		if (modeParams === 'manual') {
			const assignmentCollection = this.getNodeParameter(
				'paramsBlockManual',
				itemIndex,
				{},
			) as AssignmentCollectionValue;
			body.params = convertAssignmentCollectionToObject(assignmentCollection);
		} else {
			const params = this.getNodeParameter('paramsBlockJson', itemIndex, '{}') as string;
			body.params = parseJsonParameter(this, params, 'Parameters');
		}

		// Handle arguments mode
		const argsMode = this.getNodeParameter('modeArguments', itemIndex, 'manual') as string;
		if (argsMode === 'manual') {
			const assignmentCollection = this.getNodeParameter(
				'argumentsBlockManual',
				itemIndex,
				{},
			) as AssignmentCollectionValue;
			body.args = convertAssignmentCollectionToObject(assignmentCollection);
		} else {
			const args = this.getNodeParameter('argumentsBlockJson', itemIndex, '{}') as string;
			body.args = parseJsonParameter(this, args, 'Arguments');
		}
	}

	const isJsonOutput = responseFormat === 'application/json';

	// Prepare request options
	const requestOptions: IDataObject = {
		headers: {
			Accept: responseFormat,
		},
		json: isJsonOutput,
	};

	// For binary formats (CSV, Arrow), we need raw buffer data
	if (!isJsonOutput) {
		requestOptions.encoding = null; // Get binary data as Buffer
	}

	// Make API request using centralized wrapper
	const response = await coginitiApiRequest.call(
		this,
		'POST',
		endpoint,
		body,
		undefined,
		requestOptions,
	);

	// Handle response based on format
	if (isJsonOutput) {
		// JSON format - return in json field
		let responseData: IDataObject;
		if (typeof response === 'string') {
			responseData = { data: response };
		} else {
			responseData = (response as IDataObject) || {};
		}

		return {
			json: responseData,
			pairedItem: { item: itemIndex },
		};
	} else if (responseFormat === 'text/csv') {
		// CSV format - return as text in json field
		const csvText = Buffer.isBuffer(response)
			? (response as Buffer).toString('utf-8')
			: String(response);

		return {
			json: { data: csvText },
			pairedItem: { item: itemIndex },
		};
	} else if (responseFormat === 'application/vnd.apache.arrow.stream') {
		// Binary formats (Arrow) - return in binary field
		const buffer = Buffer.isBuffer(response) ? response : Buffer.from(String(response));

		const binaryData = await this.helpers.prepareBinaryData(
			buffer,
			undefined,
			responseFormat,
		);

		return {
			json: {},
			binary: {
				data: {
					fileExtension: 'arrow',
					...binaryData
				},
			},
			pairedItem: { item: itemIndex },
		};
	}

	throw new NodeOperationError(this.getNode(), `Unrecognized responseFormat: ${responseFormat}`);
}

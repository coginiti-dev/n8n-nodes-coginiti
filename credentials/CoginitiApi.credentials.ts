import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CoginitiApi implements ICredentialType {
	name = 'coginitiApi';

	displayName = 'Coginiti API';

	documentationUrl = 'https://support.coginiti.co/hc/en-us/articles/18723746168087-Managing-Personal-Access-Tokens';

	icon: Icon = 'file:icons/coginiti.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Hostname',
			name: 'hostname',
			type: 'string',
			required: true,
			placeholder: 'https://your-instance.coginiti.com',
			description: 'The hostname of your Coginiti instance',
			default: '',
		},
		{
			displayName: 'Personal Access Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			description: 'Personal access token created in the Coginiti UI',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.hostname}}/api/v1/scim/v2',
			url: '/Users',
		},
	};
}

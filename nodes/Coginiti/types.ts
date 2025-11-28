/**
 * Type definitions for Coginiti node
 */

export type CoginitiResource = 'catalog' | 'execute' | 'user' | 'group';

export type CatalogOperation = 'listAssets' | 'getAsset';

export type ExecuteOperation = 'executeScript' | 'executeBlock';

export type ScimOperation = 'create' | 'get' | 'list' | 'update' | 'delete';

export type CoginitiOperation = CatalogOperation | ExecuteOperation | ScimOperation;

export interface CoginitiCredentials {
	hostname: string;
	apiKey: string;
}

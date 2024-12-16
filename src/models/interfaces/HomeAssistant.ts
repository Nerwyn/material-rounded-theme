import {
	Auth,
	Connection,
	HassConfig,
	HassEntities,
	HassEntity,
	HassServiceTarget,
	HassServices,
	MessageBase,
} from 'home-assistant-js-websocket';

export interface HomeAssistant {
	auth: Auth; // & { external?: ExternalMessaging };
	connection: Connection;
	connected: boolean;
	states: HassEntities;
	// entities: { [id: string]: EntityRegistryDisplayEntry };
	// devices: { [id: string]: DeviceRegistryEntry };
	// areas: { [id: string]: AreaRegistryEntry };
	// floors: { [id: string]: FloorRegistryEntry };
	services: HassServices;
	config: HassConfig;
	themes: Themes;
	// selectedTheme: ThemeSettings | null;
	// panels: Panels;
	panelUrl: string;
	// i18n
	// current effective language in that order:
	//   - backend saved user selected language
	//   - language in local app storage
	//   - browser language
	//   - english (en)
	language: string;
	// local stored language, keep that name for backward compatibility
	selectedLanguage: string | null;
	// locale: FrontendLocaleData;
	// resources: Resources;
	// localize: LocalizeFunc;
	// translationMetadata: TranslationMetadata;
	suspendWhenHidden: boolean;
	enableShortcuts: boolean;
	vibrate: boolean;
	debugConnection: boolean;
	dockedSidebar: 'docked' | 'always_hidden' | 'auto';
	defaultPanel: string;
	moreInfoEntityId: string | null;
	user?: CurrentUser;
	// userData?: CoreFrontendUserData | null;
	// hassUrl(path?): string;
	callService(
		domain: ServiceCallRequest['domain'],
		service: ServiceCallRequest['service'],
		serviceData?: ServiceCallRequest['serviceData'],
		target?: ServiceCallRequest['target'],
		notifyOnError?: boolean,
		returnResponse?: boolean,
	): Promise<ServiceCallResponse>;
	callApi<T>(
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		path: string,
		parameters?: Record<string, any>,
		headers?: Record<string, string>,
	): Promise<T>;
	fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
	sendWS(msg: MessageBase): void;
	callWS<T>(msg: MessageBase): Promise<T>;
	// loadBackendTranslation(
	// 	category: Parameters<typeof getHassTranslations>[2],
	// 	integrations?: Parameters<typeof getHassTranslations>[3],
	// 	configFlow?: Parameters<typeof getHassTranslations>[4],
	// ): Promise<LocalizeFunc>;
	// loadFragmentTranslation(
	// 	fragment: string,
	// ): Promise<LocalizeFunc | undefined>;
	formatEntityState(stateObj: HassEntity, state?: string): string;
	formatEntityAttributeValue(
		stateObj: HassEntity,
		attribute: string,
		value?: any,
	): string;
	formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

export interface Context {
	id: string;
	parent_id?: string;
	user_id?: string | null;
}

export interface ServiceCallResponse {
	context: Context;
	response?: any;
}

export interface ServiceCallRequest {
	domain: string;
	service: string;
	serviceData?: Record<string, any>;
	target?: HassServiceTarget;
}

export interface MFAModule {
	id: string;
	name: string;
	enabled: boolean;
}

export interface CurrentUser {
	id: string;
	is_owner: boolean;
	is_admin: boolean;
	name: string;
	credentials: Credential[];
	mfa_modules: MFAModule[];
}

export interface ThemeVars {
	// Incomplete
	'primary-color': string;
	'text-primary-color': string;
	'accent-color': string;
	[key: string]: string;
}

export type Theme = ThemeVars & {
	modes?: {
		light?: ThemeVars;
		dark?: ThemeVars;
	};
};

export interface Themes {
	default_theme: string;
	default_dark_theme: string | null;
	themes: Record<string, Theme>;
	// Currently effective dark mode. Will never be undefined. If user selected "auto"
	// in theme picker, this property will still contain either true or false based on
	// what has been determined via system preferences and support from the selected theme.
	darkMode: boolean;
	// Currently globally active theme name
	theme: string;
}

export type HapticType =
	| 'success'
	| 'warning'
	| 'failure'
	| 'light'
	| 'medium'
	| 'heavy'
	| 'selection';

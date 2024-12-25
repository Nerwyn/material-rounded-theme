export {};

declare global {
	interface Window {
		externalApp?: {
			externalBus: (msg: string) => void;
		};
		webkit?: {
			messageHandlers: {
				externalBus: {
					postMessage: (msg: any) => void;
				};
			};
		};
	}
}

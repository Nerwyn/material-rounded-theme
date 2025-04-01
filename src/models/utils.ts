import { HassElement } from './interfaces';

/**
 * Get theme color token
 * @param {string} color Material Dynamic Color key
 * @returns {string} Material Dynamic Color token
 */
export function getToken(color: string): string {
	return color.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Wait for home-assistant-main shadow-root to load, then return home-assistant-main
 * @returns {ShadowRoot} home-assistant-main element
 */
export async function getHomeAssistantMainAsync(): Promise<HassElement> {
	const ha = (await querySelectorAsync(
		await getAsync(
			await querySelectorAsync(document, 'home-assistant'),
			'shadowRoot',
		),
		'home-assistant-main',
	)) as HassElement;
	await getAsync(ha, 'shadowRoot');
	return ha;
}

/**
 * Get targets to apply or remove theme colors to/from
 * @returns {HTMLElement[]} HTML Elements to apply/remove theme to/from
 */
export async function getTargets(): Promise<HTMLElement[]> {
	const targets: HTMLElement[] = [
		(await querySelectorAsync(document, 'html')) as HTMLElement,
	];

	// Add-ons and HACS iframe
	const ha = await getHomeAssistantMainAsync();
	const iframe = ha.shadowRoot
		?.querySelector('iframe')
		?.contentWindow?.document?.querySelector('body');
	if (iframe) {
		targets.push(iframe);
	}
	return targets;
}

/**
 * Asynchronous query selector
 * @param {ParentNode} parent Element to query
 * @param {string} selector Query selector string
 * @param {number} [timeout=60000] Timeout until promise rejection in milliseconds, defaults to 60000
 * @returns
 */
export async function querySelectorAsync(
	parent: ParentNode,
	selector: string,
	timeout = 60000,
): Promise<HTMLElement> {
	return new Promise((resolve, reject) => {
		const element = parent.querySelector(selector) as HTMLElement;
		if (element) {
			resolve(element);
		}

		const rejectTimeout = setTimeout(
			() =>
				reject(
					`Timeout waiting for ${selector} in ${parent} after ${timeout}ms.`,
				),
			timeout,
		);

		const observer = new MutationObserver(() => {
			const element = parent.querySelector(selector) as HTMLElement;
			if (element) {
				clearTimeout(rejectTimeout);
				observer.disconnect();
				resolve(element);
			}
		});
		observer.observe(parent, { childList: true, subtree: true });
	});
}

/**
 * Asynchronous getter which waits for value to not be neither undefined or null
 * @param {Node} element node to get value from
 * @param {string} key key to get value of
 * @param {number} [timeout=60000] Timeout until promise rejection in milliseconds, defaults to 60000
 * @returns
 */
export async function getAsync(
	element: Node,
	key: string,
	timeout = 60000,
): Promise<any> {
	let sleep = 1;
	setTimeout(() => (sleep = 10), 100);
	setTimeout(() => (sleep = 100), 1000);
	setTimeout(() => (sleep = 1000), 5000);

	let kill = false;
	setTimeout(() => (kill = true), timeout);

	while (!(key in element) || element[key as keyof object] == null) {
		if (kill) {
			console.error(
				`Timeout waiting for ${key} in ${element} after ${timeout}ms.`,
			);
			break;
		}
		await new Promise((resolve) => setTimeout(resolve, sleep));
	}
	return element[key as keyof object];
}

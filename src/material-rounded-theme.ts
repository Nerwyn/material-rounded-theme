import {
	argbFromHex,
	DynamicColor,
	Hct,
	hexFromArgb,
	MaterialDynamicColors,
	SchemeTonalSpot,
} from '@material/material-color-utilities';
import { HassElement } from './models/interfaces';

const colors: (keyof typeof MaterialDynamicColors)[] = [
	'primary',
	'onPrimary',
	'primaryContainer',
	'onPrimaryContainer',
	'primaryPaletteKeyColor',
	'inversePrimary',
	'primaryFixed',
	'primaryFixedDim',
	'onPrimaryFixed',
	'onPrimaryFixedVariant',
	'secondary',
	'onSecondary',
	'secondaryContainer',
	'onSecondaryContainer',
	'secondaryPaletteKeyColor',
	'secondaryFixed',
	'secondaryFixedDim',
	'onSecondaryFixed',
	'onSecondaryFixedVariant',
	'tertiary',
	'onTertiary',
	'tertiaryContainer',
	'onTertiaryContainer',
	'tertiaryPaletteKeyColor',
	'tertiaryFixed',
	'tertiaryFixedDim',
	'onTertiaryFixed',
	'onTertiaryFixedVariant',
	'neutralPaletteKeyColor',
	'neutralVariantPaletteKeyColor',
	'error',
	'onError',
	'errorContainer',
	'onErrorContainer',
	'surface',
	'onSurface',
	'surfaceVariant',
	'onSurfaceVariant',
	'surfaceDim',
	'surfaceBright',
	'surfaceContainerLowest',
	'surfaceContainerLow',
	'surfaceContainer',
	'surfaceContainerHigh',
	'surfaceContainerHighest',
	'inverseSurface',
	'inverseOnSurface',
	'surfaceTint',
	'outline',
	'outlineVariant',
	'shadow',
	'scrim',
];

async function main() {
	// Wait for certain elements to load, especially when installed as a module
	const html = (await querySelectorAsync(
		document,
		'html',
	)) as HTMLHtmlElement;
	const ha = (await querySelectorAsync(
		document,
		'home-assistant',
	)) as HassElement;
	const haShadowRoot = await getAsync(ha, 'shadowRoot');
	const haMain = await querySelectorAsync(
		haShadowRoot,
		'home-assistant-main',
	);
	const haMainShadowRoot = await getAsync(haMain, 'shadowRoot');

	// Sensor names
	const userName = ha.hass.user?.name.toLowerCase().replace(/ /g, '_');
	const userId = ha.hass.user?.id;
	const sensorName = 'sensor.material_rounded_base_color';
	const userNameSensorName = `${sensorName}_${userName}`;
	const userIdSensorName = `${sensorName}_${userId}`;

	/** Targets to apply or remove theme colors to/from */
	function getTargets() {
		const targets: HTMLElement[] = [html as HTMLElement];

		// Add-ons and HACS iframe
		const iframe = haMainShadowRoot
			?.querySelector('iframe')
			?.contentWindow?.document?.querySelector('body');
		if (iframe) {
			targets.push(iframe);
		}
		return targets;
	}

	/** Get theme color token */
	function getToken(color: string) {
		return color.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}

	/** Remove theme colors */
	function unsetTheme() {
		const targets = getTargets();
		for (const target of targets) {
			for (const color of colors) {
				const token = getToken(color);
				target?.style.removeProperty(`--md-sys-color-${token}-light`);
				target?.style.removeProperty(`--md-sys-color-${token}-dark`);
			}
		}
		console.info(
			'%c Material design system colors removed. ',
			'color: #ffffff; background: #4c5c92; font-weight: bold; border-radius: 32px;',
		);
	}

	/**
	 * Generate and set theme colors based on user defined sensors
	 * Unsets theme if no sensor found or on error
	 */
	function setTheme() {
		{
			try {
				const themeName = ha.hass?.themes?.theme ?? '';
				if (
					themeName.includes('Material Rounded') ||
					themeName.includes('Material You')
				) {
					let baseColor: string | undefined;

					// User specific base color
					if (userName) {
						baseColor = ha.hass.states[userNameSensorName]?.state;
					}
					if (!baseColor && userId) {
						baseColor = ha.hass.states[userIdSensorName]?.state;
					}

					// General base color
					if (!baseColor) {
						baseColor = ha.hass.states[sensorName]?.state;
					}

					// Only update if base color is provided
					if (baseColor) {
						const targets = getTargets();

						for (const mode of ['light', 'dark']) {
							const schemeTonalSpot = new SchemeTonalSpot(
								Hct.fromInt(argbFromHex(baseColor)),
								mode == 'dark',
								0,
							);

							for (const color of colors) {
								const hex = hexFromArgb(
									(
										MaterialDynamicColors[
											color
										] as DynamicColor
									).getArgb(schemeTonalSpot),
								);
								const token = getToken(color);
								for (const target of targets) {
									target.style.setProperty(
										`--md-sys-color-${token}-${mode}`,
										hex,
									);
								}
							}
						}

						// This explicit background color breaks color theme on some pages
						html?.style.removeProperty('background-color');

						const primary = html.style.getPropertyValue(
							'--md-sys-color-primary-light',
						);
						const onPrimary = html.style.getPropertyValue(
							'--md-sys-color-on-primary-light',
						);
						console.info(
							`%c Material design system colors updated using user defined base color ${baseColor}. `,
							`color: ${onPrimary}; background: ${primary}; font-weight: bold; border-radius: 32px;`,
						);
					} else {
						unsetTheme();
					}
				}
			} catch (e) {
				console.error(e);
				unsetTheme();
			}

			// Update companion app app and navigation bar colors
			const msg = { type: 'theme-update' };
			if (window.externalApp) {
				window.externalApp.externalBus(JSON.stringify(msg));
			} else if (window.webkit) {
				window.webkit.messageHandlers.externalBus.postMessage(msg);
			}
		}
	}

	setTheme();

	// Trigger on user color sensor change
	ha.hass.connection.subscribeMessage(
		() => setTheme(),
		{
			type: 'subscribe_trigger',
			trigger: {
				platform: 'state',
				entity_id: [
					sensorName,
					userNameSensorName,
					userIdSensorName,
				].filter((entityId) => ha.hass.states[entityId]),
			},
		},
		{ resubscribe: true },
	);

	// Trigger on theme changed event
	ha.hass.connection.subscribeEvents(() => setTheme(), 'themes_updated');

	// Trigger on set theme service call
	ha.hass.connection.subscribeEvents((e: Record<string, any>) => {
		if (e?.data?.service == 'set_theme') {
			setTimeout(() => setTheme(), 1000);
		}
	}, 'call_service');

	// Trigger on iframe node added to home-assistant-main
	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName == 'IFRAME') {
					const iframe = (await querySelectorAsync(
						haMainShadowRoot,
						'iframe',
					)) as HTMLIFrameElement;
					const contentWindow = await getAsync(
						iframe,
						'contentWindow',
					);
					const document = await getAsync(contentWindow, 'document');
					await querySelectorAsync(document, 'body');
					setTheme();
				}
			}
		}
	});
	observer.observe(haMain?.shadowRoot as Node, {
		subtree: true,
		childList: true,
	});
}

async function querySelectorAsync(
	parent: ParentNode,
	selector: string,
	timeout = 60000,
): Promise<Element> {
	return new Promise((resolve, reject) => {
		const element = parent.querySelector(selector);
		if (element) {
			return resolve(element);
		}

		const rejectTimeout = setTimeout(
			() =>
				reject(
					`Timeout waiting for ${selector} in ${parent} after ${timeout}ms.`,
				),
			timeout,
		);

		const observer = new MutationObserver(() => {
			const element = parent.querySelector(selector);
			if (element) {
				clearTimeout(rejectTimeout);
				observer.disconnect();
				resolve(element);
			}
		});
		observer.observe(parent, { childList: true, subtree: true });
	});
}

async function getAsync(
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

	while (!(key in element) || element[key as keyof object] == null || kill) {
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

main();

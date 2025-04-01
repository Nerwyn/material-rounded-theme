import {
	argbFromHex,
	DynamicColor,
	Hct,
	hexFromArgb,
	MaterialDynamicColors,
	SchemeTonalSpot,
} from '@material/material-color-utilities';

import { colors, logStyles } from './models/constants';
import { HassElement } from './models/interfaces';
import {
	getAsync,
	getHomeAssistantMainAsync,
	getTargets,
	getToken,
	querySelectorAsync,
} from './models/utils';

/** Remove theme colors */
export async function unsetTheme() {
	const targets = await getTargets();
	for (const color of colors) {
		for (const target of targets) {
			const token = getToken(color);
			target?.style.removeProperty(`--md-sys-color-${token}-light`);
			target?.style.removeProperty(`--md-sys-color-${token}-dark`);
		}
	}
	console.info('%c Material design system colors removed. ', logStyles());
}

async function main() {
	// Wait for home-assistant-main to load
	const html = await querySelectorAsync(document, 'html');
	const ha = await getHomeAssistantMainAsync();

	// Sensor names
	const userName = ha.hass.user?.name.toLowerCase().replace(/ /g, '_');
	const userId = ha.hass.user?.id;
	const sensorName = 'sensor.material_rounded_base_color';
	const userNameSensorName = `${sensorName}_${userName}`;
	const userIdSensorName = `${sensorName}_${userId}`;

	/** Generate and set theme colors based on user defined sensors */
	async function setTheme() {
		const hass = (document.querySelector('home-assistant') as HassElement)
			.hass;
		{
			try {
				const themeName = hass?.themes?.theme ?? '';
				if (
					themeName.includes('Material Rounded') ||
					themeName.includes('Material You')
				) {
					let baseColor: string | undefined;

					// User specific base color
					if (userName) {
						baseColor = hass.states[userNameSensorName]?.state;
					}
					if (!baseColor && userId) {
						baseColor = hass.states[userIdSensorName]?.state;
					}

					// General base color
					if (!baseColor) {
						baseColor = hass.states[sensorName]?.state;
					}

					// Only update if base color is provided
					if (baseColor) {
						const targets = await getTargets();

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

						const background = html.style.getPropertyValue(
							'--md-sys-color-primary-light',
						);
						const color = html.style.getPropertyValue(
							'--md-sys-color-on-primary-light',
						);
						console.info(
							`%c Material design system colors updated using user defined base color ${baseColor}. `,
							logStyles(color, background),
						);
					} else {
						await unsetTheme();
					}
				}
			} catch (e) {
				console.error(e);
				await unsetTheme();
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

	await setTheme();

	// Trigger on user color sensor change
	ha.hass.connection.subscribeMessage(
		async () => await setTheme(),
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
	ha.hass.connection.subscribeEvents(
		async () => await setTheme(),
		'themes_updated',
	);

	// Trigger on set theme service call
	ha.hass.connection.subscribeEvents((e: Record<string, any>) => {
		if (e?.data?.service == 'set_theme') {
			setTimeout(async () => await setTheme(), 1000);
		}
	}, 'call_service');

	// Trigger on iframe node added to home-assistant-main
	const observer = new MutationObserver(async (mutations) => {
		for (const mutation of mutations) {
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.nodeName == 'IFRAME') {
					const iframe = (await querySelectorAsync(
						ha.shadowRoot as ShadowRoot,
						'iframe',
					)) as HTMLIFrameElement;
					const contentWindow = await getAsync(
						iframe,
						'contentWindow',
					);
					const document = await getAsync(contentWindow, 'document');
					await querySelectorAsync(document, 'body');
					await setTheme();
				}
			}
		}
	});
	observer.observe(ha.shadowRoot as Node, {
		subtree: true,
		childList: true,
	});
}

main();

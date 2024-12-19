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

Promise.resolve(customElements.whenDefined('home-assistant')).then(() => {
	const ha = document.querySelector('home-assistant') as HassElement;
	const html = document.querySelector('html');
	const userId = ha.hass.user?.name.toLowerCase().replace(' ', '_');
	const sensorName = 'sensor.material_rounded_base_color';
	const userSensorName = `${sensorName}_${userId}`;

	function unsetTheme() {
		for (const key of colors) {
			const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			html?.style.removeProperty(`--md-sys-color-${token}-light`);
			html?.style.removeProperty(`--md-sys-color-${token}-dark`);
		}
		console.info('Material design system colors removed.');
	}

	function setTheme() {
		{
			try {
				const themeName = ha?.hass?.themes?.theme ?? '';
				if (
					themeName.includes('Material Rounded') ||
					themeName.includes('Material You')
				) {
					let baseColor: string | undefined;

					// User specific base color
					if (userId) {
						baseColor = ha.hass.states[userSensorName]?.state;
					}

					// General base color
					if (!baseColor) {
						baseColor = ha.hass.states[sensorName]?.state;
					}

					// Only update if base color is provided
					if (baseColor) {
						for (const mode of ['light', 'dark']) {
							const schemeTonalSpot = new SchemeTonalSpot(
								Hct.fromInt(argbFromHex(baseColor)),
								mode == 'dark',
								0,
							);

							const scheme: Record<string, number> = {};
							for (const color of colors) {
								scheme[color] = (
									MaterialDynamicColors[color] as DynamicColor
								).getArgb(schemeTonalSpot);
							}
							for (const [key, value] of Object.entries(scheme)) {
								const token = key
									.replace(/([a-z])([A-Z])/g, '$1-$2')
									.toLowerCase();
								const color = hexFromArgb(value);
								html?.style.setProperty(
									`--md-sys-color-${token}-${mode}`,
									color,
								);
							}
						}

						// This explicit background color breaks color theme on some pages
						html?.style.removeProperty('background-color');

						console.info(
							`Material design system colors updated using user defined base color ${baseColor}.`,
						);
					} else {
						unsetTheme();
					}
				}
			} catch (e) {
				console.error(e);
				unsetTheme();
			}
		}
	}

	setTheme();

	// Trigger on use color sensor change
	ha.hass.connection.subscribeMessage(
		() => setTheme(),
		{
			type: 'subscribe_trigger',
			trigger: {
				platform: 'state',
				entity_id: [sensorName, userSensorName],
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
});

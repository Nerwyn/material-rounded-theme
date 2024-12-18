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
	const userId = ha.hass.user?.name.toLowerCase().replace(' ', '_');
	const sensorName = 'sensor.material_rounded_base_color';
	const userSensorName = `${sensorName}_${userId}`;

	function setTheme() {
		{
			try {
				const themeName = ha?.hass?.themes?.theme ?? '';
				if (
					themeName.includes('Material Rounded') ||
					themeName.includes('Material You')
				) {
					let baseColor: string | undefined;
					let isDarkMode = ha.hass.themes.darkMode;

					// Fixed light/dark mode versions of theme
					if (!ha.hass.themes.themes[themeName].modes) {
						if (themeName.includes('Light')) {
							isDarkMode = false;
						} else if (themeName.includes('Dark')) {
							isDarkMode = true;
						}
					}

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
						const schemeTonalSpot = new SchemeTonalSpot(
							Hct.fromInt(argbFromHex(baseColor)),
							isDarkMode,
							0,
						);
						const scheme: Record<string, number> = {};
						for (const color of colors) {
							scheme[color] = (
								MaterialDynamicColors[color] as DynamicColor
							).getArgb(schemeTonalSpot);
						}
						const target = document.querySelector('html');
						for (const [key, value] of Object.entries(scheme)) {
							const token = key
								.replace(/([a-z])([A-Z])/g, '$1-$2')
								.toLowerCase();
							const color = hexFromArgb(value);
							target?.style.setProperty(
								`--md-sys-color-${token}`,
								color,
							);
						}
						console.info(
							`Material Rounded Theme colors updated using user defined base color ${baseColor} and ${isDarkMode ? 'dark' : 'light'} mode.`,
						);
					}
				}
			} catch (e) {
				console.error(e);
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

	// Trigger on window light/dark change
	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', () => setTheme());
});

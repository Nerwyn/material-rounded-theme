import {
	applyTheme,
	argbFromHex,
	themeFromSourceColor,
} from '@material/material-color-utilities';
import { HassElement } from './models/interfaces';

Promise.resolve(customElements.whenDefined('home-assistant')).then(() => {
	const ha = document.querySelector('home-assistant') as HassElement;
	const userId = ha.hass.user?.name.toLowerCase().replace(' ', '_');
	const sensorName = 'sensor.material_rounded_base_color';
	const userSensorName = `${sensorName}_${userId}`;

	let baseColor: string | undefined;
	let isDarkMode = ha.hass.themes.darkMode;

	function setTheme() {
		{
			try {
				const themeName = ha?.hass?.themes?.theme ?? '';
				if (themeName.includes('Material ')) {
					let newIsDarkMode = ha.hass.themes.darkMode;

					// Fixed light/dark mode versions of theme
					if (!ha.hass.themes.themes[themeName].modes) {
						if (themeName.includes('Light')) {
							newIsDarkMode = false;
						} else if (themeName.includes('Dark')) {
							newIsDarkMode = true;
						}
					}

					let newBaseColor: string | undefined;

					// User specific base color
					if (userId) {
						newBaseColor = ha.hass.states[userSensorName]?.state;
					}

					// General base color
					if (!newBaseColor) {
						newBaseColor = ha.hass.states[sensorName]?.state;
					}

					// Only update if base color or dark mode changed
					if (
						newBaseColor != baseColor ||
						newIsDarkMode != isDarkMode
					) {
						baseColor = newBaseColor;
						isDarkMode = newIsDarkMode;

						if (baseColor) {
							const theme = themeFromSourceColor(
								argbFromHex(baseColor),
							);
							applyTheme(theme, {
								target: document.querySelector(
									'html',
								) as HTMLElement,
								dark: isDarkMode,
							});
							console.info(
								`Material Rounded Theme colors updated using user defined base color ${baseColor} and ${isDarkMode ? 'dark' : 'light'} mode.`,
							);
						}
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	setTheme();

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

	// TODO trigger on dark mode change
});

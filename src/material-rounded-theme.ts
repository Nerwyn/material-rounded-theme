import {
	applyTheme,
	argbFromHex,
	themeFromSourceColor,
} from '@material/material-color-utilities';
import { HassElement } from './models/interfaces';

Promise.resolve(customElements.whenDefined('home-assistant')).then(() => {
	let baseColor: string | undefined = undefined;
	let isDarkMode: boolean = false;

	function setTheme() {
		{
			try {
				const ha = document.querySelector(
					'home-assistant',
				) as HassElement;

				if (ha?.hass?.themes?.theme?.includes('Material Rounded')) {
					let newBaseColor: string | undefined;

					// User specific base color
					const userId = ha.hass.user?.name
						.toLowerCase()
						.replace(' ', '_');
					if (userId) {
						newBaseColor =
							ha.hass.states[
								`sensor.material_rounded_base_color_${userId}`
							]?.state;
					}

					// General base color
					if (!newBaseColor) {
						newBaseColor =
							ha.hass.states[`sensor.material_rounded_base_color`]
								?.state;
					}

					const newIsDarkMode = ha.hass.themes.darkMode;

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
								`Material Rounded Theme colors updated using user defined base color ${baseColor}.`,
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
	setInterval(() => setTheme(), 10000);
});

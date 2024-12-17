import {
	applyTheme,
	argbFromHex,
	themeFromSourceColor,
} from '@material/material-color-utilities';
import { HassElement, HomeAssistant } from './models/interfaces';

Promise.resolve(customElements.whenDefined('home-assistant')).then(() => {
	const homeAssistant = document.querySelector(
		'home-assistant',
	) as HassElement;
	const hass: HomeAssistant = homeAssistant?.hass;

	if (hass && hass.themes.theme.includes('Material Rounded')) {
		let baseColor: string | undefined = undefined;
		const userId = hass.user?.name.toLowerCase().replace(' ', '_');

		// User specific base color
		if (userId) {
			baseColor =
				hass.states[`sensor.material_rounded_base_color_${userId}`]
					?.state;
		}

		// General base color
		if (!baseColor) {
			baseColor =
				hass.states[`sensor.material_rounded_base_color`]?.state;
		}

		if (baseColor) {
			const isDarkMode = hass.themes.darkMode;
			const theme = themeFromSourceColor(argbFromHex(baseColor));
			console.log(theme);
			applyTheme(theme, {
				target: homeAssistant as HassElement,
				dark: isDarkMode,
			});
			console.info(
				`Material Rounded theme colors generated using user defined base color ${baseColor}.`,
			);
		}
	}
});

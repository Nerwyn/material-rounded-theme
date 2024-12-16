import {
	applyTheme,
	argbFromHex,
	themeFromSourceColor,
} from '@material/material-color-utilities';
import { HassElement, HomeAssistant } from './models/interfaces';

function getBaseColor(hass: HomeAssistant): string | undefined {
	let baseColor: string | undefined = undefined;
	const userId = hass.user?.name.toLowerCase().replace(' ', '_');
	if (userId) {
		baseColor =
			hass.states[`sensor.material_rounded_base_color_${userId}`]?.state;
	}
	if (!baseColor) {
		baseColor = hass.states[`sensor.material_rounded_base_color`]?.state;
	}
	return baseColor;
}

Promise.resolve(customElements.whenDefined('home-assistant')).then(() => {
	const homeAssistant = document.querySelector(
		'home-assistant',
	) as HassElement;
	const hass: HomeAssistant = homeAssistant?.hass;
	if (hass && hass.themes.theme.includes('Material Rounded')) {
		const baseColor = getBaseColor(hass);
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

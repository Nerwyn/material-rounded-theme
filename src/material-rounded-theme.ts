import {
	applyTheme,
	argbFromHex,
	themeFromSourceColor,
} from '@material/material-color-utilities';
import { HassElement, HomeAssistant } from './models/interfaces';

function getBaseColor(hass: HomeAssistant): string | undefined {
	console.log('Getting user defined base color');
	let baseColor: string | undefined = undefined;
	const userId = hass.user?.name.toLowerCase().replace(' ', '_');
	if (userId) {
		console.log(`Getting base color for user ${userId}`);
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
		console.log('Material Rounded theme detected!');

		const baseColor = getBaseColor(hass);
		if (baseColor) {
			console.log(`Base color ${baseColor} detected.`);
			const theme = themeFromSourceColor(argbFromHex(baseColor));
			console.log(theme);
			applyTheme(theme, { target: homeAssistant as HassElement });
		} else {
			console.log('No base color detected!');
		}
	}
});

import {
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeRainbow,
	SchemeTonalSpot,
	SchemeVibrant,
} from '@material/material-color-utilities';

export type Scheme =
	| typeof SchemeContent
	| typeof SchemeExpressive
	| typeof SchemeFidelity
	| typeof SchemeFruitSalad
	| typeof SchemeMonochrome
	| typeof SchemeNeutral
	| typeof SchemeRainbow
	| typeof SchemeTonalSpot
	| typeof SchemeVibrant;

export interface IScheme {
	name: string;
	class: Scheme;
}

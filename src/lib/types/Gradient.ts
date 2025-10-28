export default interface Gradient {
	colors: GradientColor[];

	horizontal: boolean;
}

export interface GradientColor {
	color: string;
	stop: number;
}

export const TemperatureGradient: Gradient = {
	colors: [
		{ color: 'var(--error)', stop: 0 },
		{ color: 'var(--warning)', stop: 50 },
		{ color: 'var(--info)', stop: 100 }
	],
	horizontal: false
};

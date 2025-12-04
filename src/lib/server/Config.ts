import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

let cachedConfig: Config | null = null;
let configFilePath: string | null = null;
let lastModified: number | null = null;

export default async function getConfig(): Promise<Config> {
	try {
		const cwd = process.cwd();
		const configPath = path.resolve(cwd, 'dashboard.yaml');

		// Return cached config if file hasn't changed
		const stats = await fs.promises.stat(configPath);
		const currentModified = stats.mtime.getTime();
		if (cachedConfig && configPath === configFilePath && currentModified === lastModified) {
			return cachedConfig;
		}

		const data = await fs.promises.readFile(configPath, 'utf8');

		try {
			const config: Config = yaml.parse(data);
			if (!config.plugins)
				config.plugins = {
					uptimekuma: {},
					pihole: {},
					gitea: {},
					gotify: {},
					n8n: {},
					homeassistant: {}
				};
			if (!config.plugins.uptimekuma) config.plugins.uptimekuma = {};
			if (!config.plugins.pihole) config.plugins.pihole = {};
			if (!config.plugins.gotify) config.plugins.gotify = {};
			if (!config.plugins.n8n) config.plugins.n8n = {};
			if (!config.plugins.homeassistant) config.plugins.homeassistant = {};

			if (!config.widgets) config.widgets = [];
			if (!config.config) config.config = { historyLength: 120, refreshCron: '*/5 * * * *' };
			if (!config.config.historyLength) config.config.historyLength = 120;
			if (!config.config.refreshCron) config.config.refreshCron = '*/5 * * * *';

			cachedConfig = config;
			configFilePath = configPath;
			lastModified = currentModified;

			return config;
		} catch (e) {
			throw new Error(
				'Failed to parse dashboard configuration. Please check the syntax of the dashboard.yaml file.'
			);
		}
	} catch (e) {
		throw new Error(
			'Failed to read dashboard configuration. Could not find the dashboard.yaml file.'
		);
	}
}

export function clearConfigCache(): void {
	cachedConfig = null;
	configFilePath = null;
	lastModified = null;
}

interface Config {
	config: {
		historyLength: number;
		refreshCron: string;

		background?: {
			url: string;
			blur?: string;
			brightness?: string;
		};
	};

	plugins: {
		gitea: {
			url?: string;
		};
		gotify: {
			url?: string;
		};
		homeassistant: {
			url?: string;
		};
		n8n: {
			url?: string;
		};
		uptimekuma: {
			url?: string;
			statusPage?: string;
		};
		pihole: {
			url?: string;
		};
	};

	widgets: Array<WidgetData>;
}

export interface WidgetData {
	type: WidgetType;
	subtype?: WidgetSubType;
	url?: string;
	icon?: string;
	title?: string;
	subtitle?: string;
	datasource?: string;
	datapoint?: string;
	datafilters?: Record<string, string | number | boolean>;
}

export enum WidgetType {
	link = 'link',
	datawidget = 'datawidget'
}

export enum WidgetSubType {
	text = 'text',
	fill = 'fill',
	progressbar = 'progressbar',
	line = 'line',
	statushistory = 'statushistory'
}

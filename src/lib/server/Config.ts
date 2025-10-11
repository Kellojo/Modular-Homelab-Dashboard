import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export default async function getConfig(): Promise<Config> {
	try {
		const cwd = process.cwd();
		const configPath = path.resolve(cwd, 'dashboard.yaml');
		const data = await fs.promises.readFile(configPath, 'utf8');

		try {
			const config = yaml.parse(data);
			if (!config.plugins) config.plugins = {};
			if (!config.widgets) config.widgets = [];
			if (!config.historyLength) config.historyLength = 120;

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

interface Config {
	config: {
		historyLength: number;
	};

	plugins: {
		uptimekuma: {
			url: string;
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

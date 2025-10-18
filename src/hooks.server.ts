import getConfig from '$lib/server/Config';
import cron from 'node-cron';

const config = await getConfig();

cron.schedule(config.config.refreshCron, () => {
	console.log('Refreshing data...');
});

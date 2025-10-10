<script lang="ts">
	import Widget from './Widget.svelte';

	let { refreshData, content, refreshInterval = 2000, datasource, datapoint, ...props } = $props();

	$effect(() => {
		const id = setInterval(() => {
			refreshData(datasource, datapoint);
		}, refreshInterval);

		return () => clearInterval(id);
	});
</script>

<Widget {...props} {content}></Widget>

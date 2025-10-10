<script lang="ts">
	import Widget from './Widget.svelte';

	let { refreshData, content, refreshInterval = 2000, datasource, datapoint, ...props } = $props();

	$effect(() => {
		let active = true;
		async function poll() {
			while (active) {
				await pullData(); // wait for pullData to finish
				await new Promise((resolve) => setTimeout(resolve, refreshInterval));
			}
		}
		poll();

		return () => {
			active = false;
		};
	});

	function pullData() {
		refreshData(datasource, datapoint);
	}
</script>

<Widget {...props} {content}></Widget>

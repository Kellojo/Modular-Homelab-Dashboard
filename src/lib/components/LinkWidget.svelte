<script lang="ts">
	import Widget from './Widget.svelte';

	let { ...props } = $props();
</script>

<Widget {...props}></Widget>

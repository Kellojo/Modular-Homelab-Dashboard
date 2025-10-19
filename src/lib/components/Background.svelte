<script lang="ts">
	let { imagepath = './background.jpg', blur = '2rem', brightness = '1' } = $props();
</script>

<div
	class="page-background"
	style="filter: blur({blur}) brightness({brightness}); background-image: url({imagepath});"
></div>

<style>
	.page-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
</style>

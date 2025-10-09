<script lang="ts">
	let { title = '' } = $props();
</script>

<div class="title">
	<h2>{title}</h2>
</div>

<style>
	.title {
		grid-column: 1 / -1;
		display: flex;
		align-items: end;

		h2 {
			margin: 0;
			color: var(--primaryText);
			font-size: 1.5rem;

			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
</style>

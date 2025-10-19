<script lang="ts">
	let { fill, classification, ...props } = $props();
</script>

<div class="progressbar" title={props.title || ''}>
	<div class={['fill', classification]} style="--fill-level: {fill}%"></div>
</div>

<style>
	.progressbar {
		width: 100%;
		height: 1.25rem;
		background-color: var(--backgroundLight);
		border-radius: 1rem;
		box-sizing: border-box;
		padding: 0.25rem;
		overflow: hidden;
	}

	.fill {
		width: var(--fill-level, 0);
		height: 100%;
		border-radius: 1rem;
		background-color: var(--primaryText);
	}

	.success {
		background-image: linear-gradient(90deg, var(--successSecondary), var(--success));
	}
	.warning {
		background-image: linear-gradient(90deg, var(--warningSecondary), var(--warning));
	}
	.error {
		background-image: linear-gradient(90deg, var(--errorSecondary), var(--error));
	}
</style>

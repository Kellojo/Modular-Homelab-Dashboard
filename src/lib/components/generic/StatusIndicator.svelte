<script lang="ts">
	import { ValueState } from '$lib/types/valueState';

	let { classification = ValueState.Unknown } = $props();
</script>

<div class="status-indicator {classification}"></div>

<style>
	.status-indicator {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		display: inline-block;
		background-color: var(--secondaryText);
		flex-shrink: 0;
	}

	@keyframes breathe {
		0% {
			box-shadow: 0 0 4px currentColor;
		}
		50% {
			box-shadow: 0 0 12px currentColor;
		}
		100% {
			box-shadow: 0 0 4px currentColor;
		}
	}

	.success,
	.warning,
	.error {
		animation: breathe 3s ease-in-out infinite;
	}

	.success {
		background-color: var(--success);
		color: var(--success);
	}

	.warning {
		background-color: var(--warning);
		color: var(--warning);
	}

	.error {
		background-color: var(--error);
		color: var(--error);
	}
</style>

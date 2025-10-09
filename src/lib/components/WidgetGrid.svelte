<div class="grid">
	<slot></slot>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(8, var(--cellSize));
		grid-auto-rows: var(--cellSize);
		gap: var(--cellGap);
		justify-content: center;
	}

	@media (max-width: 1200px) {
		.grid {
			grid-template-columns: repeat(6, var(--cellSize));
		}
	}

	@media (max-width: 909px) {
		.grid {
			grid-template-columns: repeat(4, var(--cellSize));
		}
	}

	@media (max-width: 624px) {
		.grid {
			grid-template-columns: repeat(3, var(--cellSize));
		}
	}

	@media (max-width: 480px) {
		.grid {
			grid-template-columns: repeat(2, var(--cellSize));
		}
	}
</style>

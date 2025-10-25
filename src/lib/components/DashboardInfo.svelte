<script lang="ts">
	// @ts-ignore
	const version = __COMMIT_HASH__;
</script>

<div class="dashboard-info">
	<a
		href="https://github.com/Kellojo/Modular-Homelab-Dashboard"
		target="_blank"
		rel="noopener noreferrer">Kellojo/Modular-Homelab-Dashboard #{version}</a
	>
</div>

<style>
	.dashboard-info {
		position: fixed;
		bottom: 0;
		width: 100%;
		text-align: left;
		padding: 0.5rem;
		box-sizing: border-box;
		font-size: 0.625rem;
		opacity: 0.3;
	}

	.dashboard-info a {
		color: var(--secondaryText);
		text-decoration: none;
	}
</style>

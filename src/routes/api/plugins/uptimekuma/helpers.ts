export function getUptimeKumaStatusPageUrl(baseUrl: string, statusPage: string): string {
	return new URL(`/status/${statusPage}`, baseUrl).toString();
}

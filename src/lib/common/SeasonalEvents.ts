import { browser } from '$app/environment';

export default async function applySeasonalEvents() {
	if (!browser) return;

	const now = new Date();
	const month = now.getMonth() + 1;

	switch (month) {
		case 12:
		case 1:
			activateWinterEvents();
			break;
		default:
			// No seasonal events
			break;
	}
}

export async function activateWinterEvents() {
	const { LetItGo } = await import('let-it-go');

	console.log('Winter seaso activated!');
	console.log(document.body);
	const letItGo = new LetItGo({
		root: document.body,
		number: window.innerWidth * 0.25
	});
}

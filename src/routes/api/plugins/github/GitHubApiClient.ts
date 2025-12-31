import { Octokit } from 'octokit';
import { env } from '$env/dynamic/private';

export default class GitHubApiClient {
	public async getUser() {
		var octokit = this.getOctokitClient();
		const response = await octokit.request('GET /user');
		return response.data;
	}
	public async getFollowers(): Promise<number> {
		return (await this.getUser()).followers;
	}

	public async getRepo(owner: string, name: string) {
		var octokit = this.getOctokitClient();
		const response = await octokit.request('GET /repos/{owner}/{repo}', {
			owner: owner,
			repo: name
		});
		return response.data;
	}

	getOctokitClient(): Octokit {
		const pat = env.GITHUB_PAT;
		if (!pat) throw new Error('GITHUB_PAT is not set');

		return new Octokit({
			auth: pat
		});
	}
}

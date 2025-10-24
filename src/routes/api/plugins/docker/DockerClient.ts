import * as si from 'systeminformation';

export default class DockerClient {
	public async getContainerCount(): Promise<number> {
		const containers = await si.dockerContainers();
		return containers.length;
	}
}

export enum DockerContainerState {
	Running = 'running',
	Exited = 'exited',
	Created = 'created'
}

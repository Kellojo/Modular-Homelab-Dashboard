import * as si from 'systeminformation';

export default class DockerClient {
	public async getContainerCount(): Promise<number> {
		const containers = await si.dockerContainers(true);
		return containers.length;
	}

	public async getContainers(): Promise<si.Systeminformation.DockerContainerData[]> {
		const containers = await si.dockerContainers(true);
		return containers;
	}
}

export enum DockerContainerState {
	Running = 'running',
	Exited = 'exited',
	Created = 'created'
}

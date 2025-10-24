import * as si from 'systeminformation';

export default class DockerClient {
	public async getContainerCount(): Promise<number> {
		const containers = await si.dockerContainers();
		return containers.length;
	}

	public async getContainers(): Promise<si.Systeminformation.DockerContainerData[]> {
		const containers = await si.dockerContainers();
		return containers;
	}
}

export enum DockerContainerState {
	Running = 'running',
	Exited = 'exited',
	Created = 'created'
}

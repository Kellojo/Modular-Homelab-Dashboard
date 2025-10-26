import * as si from 'systeminformation';
import { formatFileSize } from '$lib/common/Formatter';

export default class DockerClient {
	public async getContainerCount(): Promise<number> {
		const containers = await si.dockerContainers(true);
		return containers.length;
	}

	public async getContainers(): Promise<si.Systeminformation.DockerContainerData[]> {
		const containers = await si.dockerContainers(true);
		return containers;
	}

	public async getImageCount(): Promise<number> {
		const images = await si.dockerImages(true);
		return images.length;
	}

	public async getImages(): Promise<si.Systeminformation.DockerImageData[]> {
		const [images, containers] = await Promise.all([si.dockerImages(true), this.getContainers()]);

		images.forEach((image) => {
			image.container = containers.find((container) => container.imageID === image.id)?.id || '';
		});

		return images;
	}

	public async getOverallImageSize(): Promise<string> {
		const images = await this.getImages();
		const overallSize = images.reduce((total, image) => total + (image.size || 0), 0);
		return formatFileSize(overallSize);
	}
}

export enum DockerContainerState {
	Running = 'running',
	Exited = 'exited',
	Created = 'created'
}

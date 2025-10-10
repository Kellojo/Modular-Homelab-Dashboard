export interface UptimeKumaPageResponse {
  config: StatusPageConfig;

  publicGroupList: Array<PublicMonitorGroup>;
}

interface StatusPageConfig {
  title: string;
  description: string;
  slug: string;
}
interface PublicMonitorGroup {
  id: number;
  name: string;
  weight: number;
  monitors: Array<PublicMonitor>;
}
interface PublicMonitor {
  id: number;
  name: string;
  sendUrl: number;
  type: string;
}

export interface UptimeKumaHeartbeatResponse {
  heartbeatList: Map<number, Array<HeartbeatEntry>>;
  uptimeList: { [key: string]: number };
}

interface HeartbeatEntry {
  id: number;
  msg: string;
  ping: number;
  timestamp: number;
  status: number;
}

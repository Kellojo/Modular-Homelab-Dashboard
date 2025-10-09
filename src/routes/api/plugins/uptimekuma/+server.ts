import { json } from '@sveltejs/kit';

export async function GET() {
	return json({
		name: 'Uptime Kuma'
	});
}

/*

 const statusPage = "default";

  const response = await fetch(
    "https://status.nashor.cloud:6002/api/status-page/heartbeat/" + statusPage
  );
  const heartBeat = (await response.json()) as UptimeKumaHeartbeatResponse;

  const heartBeats = heartBeat.heartbeatList;
  

  let uptimePercentage = 0;
  const uptimes = Object.keys(heartBeat.uptimeList);
  Object.keys(heartBeat.uptimeList).forEach((key: string) => {
    const uptime = heartBeat.uptimeList[key];
    uptimePercentage += uptime;
  });
  uptimePercentage /= uptimes.length;

  res.json({
    uptimePercentage: uptimePercentage.toFixed(3),
  });

*/
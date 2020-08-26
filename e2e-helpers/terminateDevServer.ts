import { request } from 'http';

export function terminateDevServer(devServerPort: number): void {
  const res = request(
    `http://localhost:${devServerPort}/terminate-dev-server`,
    {
      timeout: 300
    }
  );

  res.on('error', () => {
    /**/
  });
  res.end();
}

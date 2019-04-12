import { request } from 'http';

export async function waitForHttpStatus({
  host,
  port,
  timeout = 100,
  method: requestMethod = 'GET',
  expectedStatusCode = 200,
  canContinue = () => true
}: {
  host: string;
  port: number;
  timeout?: number;
  method?: string;
  expectedStatusCode?: number;
  canContinue?: () => boolean;
}): Promise<void> {
  const retry = () => setTimeout(main, timeout);

  function main() {
    const req = request({ port, host, method: requestMethod }, response => {
      if (response.statusCode === expectedStatusCode) {
        return Promise.resolve();
      }

      if (!canContinue()) {
        return Promise.reject();
      }

      retry();
    });

    req.on('error', retry);
    req.end();
  }

  main();
}

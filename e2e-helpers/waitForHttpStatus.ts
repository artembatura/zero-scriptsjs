import { request } from 'http';

export const waitForHttpStatus = async ({
  host,
  port,
  timeout = 100,
  ejectTimeout = 8000,
  method = 'GET',
  expectedStatusCode = 200,
  canContinue = () => true
}: {
  host: string;
  port: number;
  timeout?: number;
  ejectTimeout?: number;
  method?: string;
  expectedStatusCode?: number;
  canContinue?: () => boolean;
}) => {
  const retry = () => setTimeout(main, timeout);

  let totalTimeout = 0;
  const main = () => {
    const req = request({ port, host, method }, response => {
      if (response.statusCode === expectedStatusCode) {
        return Promise.resolve();
      }

      if (!canContinue() || totalTimeout > ejectTimeout) {
        return Promise.reject();
      }

      totalTimeout += timeout;

      retry();
    });

    req.on('error', retry);
    req.end();
  };

  main();
};

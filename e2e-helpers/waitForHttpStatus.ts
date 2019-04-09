import { request } from 'http';

export const waitForHttpStatus = ({
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
}) =>
  new Promise((resolve, reject) => {
    const retry = () => setTimeout(main, timeout);

    let totalTimeout = 0;
    const main = () => {
      const req = request({ port, host }, response => {
        if (response.statusCode === expectedStatusCode) {
          return resolve();
        }

        if (!canContinue() || totalTimeout > ejectTimeout) {
          return reject();
        }

        totalTimeout += timeout;

        retry();
      });

      req.on('error', retry);
      req.end();
    };

    main();
  });

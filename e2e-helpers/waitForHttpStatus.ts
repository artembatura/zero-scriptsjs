import { request } from 'http';

type FuncParams = {
  host: string;
  port: number;
  interval?: number;
  timeout?: number;
  method?: string;
  expectedStatusCode?: number;
  canContinue?: () => boolean;
};

export function waitForHttpStatus({
  host,
  port,
  interval = 150,
  timeout = 15000,
  method: requestMethod = 'GET',
  expectedStatusCode = 200,
  canContinue = () => true
}: FuncParams): Promise<void> {
  return new Promise(resolve => {
    let attemptsCount = 0;

    function main(retryFn: () => void) {
      attemptsCount++;

      const req = request(
        { port, host, method: requestMethod, timeout: 300 },
        response => {
          if (response.statusCode === expectedStatusCode) {
            return resolve();
          }

          retryFn();
        }
      );

      req.on('error', retryFn);
      req.end();
    }

    const retry = () => {
      if (attemptsCount * interval >= timeout) {
        throw new Error(
          'Timeout Http exception. Please, check that command is running correctly'
        );
      }

      if (!canContinue()) {
        return resolve();
      }

      setTimeout(main.bind(null, retry), interval);
    };

    main(retry);
  });
}

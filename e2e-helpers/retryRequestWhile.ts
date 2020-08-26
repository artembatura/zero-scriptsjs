import { IncomingMessage, request } from 'http';

type FuncParams = {
  port?: number;
  interval?: number;
  timeout?: number;
  method?: string;
  doWhile: (response: IncomingMessage) => boolean;
  forceResolveIf: () => boolean;
};

export function retryRequestWhile(
  host: string,
  {
    port,
    interval = 350,
    timeout = 15000,
    method: requestMethod = 'GET',
    doWhile,
    forceResolveIf
  }: FuncParams
): Promise<{ status?: number }> {
  return new Promise((resolve, reject) => {
    let attemptsCount = 0;

    function main(retryFn: () => void) {
      attemptsCount++;

      const req = request(
        { port, host, method: requestMethod, timeout: interval - 50 },
        response => {
          if (!doWhile(response)) {
            return resolve({ status: response.statusCode });
          }

          retryFn();
        }
      );

      req.on('error', retryFn);
      req.end();
    }

    const retry = () => {
      if (attemptsCount * interval >= timeout) {
        reject(
          new Error(
            'Timeout Http exception. Please, check that command is running correctly'
          )
        );
      }

      if (forceResolveIf()) {
        return resolve({
          status: undefined
        });
      }

      setTimeout(main.bind(null, retry), interval);
    };

    main(retry);
  });
}

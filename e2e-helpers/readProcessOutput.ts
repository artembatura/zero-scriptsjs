import { ChildProcessWithoutNullStreams } from 'child_process';
import { PassThrough, Stream } from 'stream';

import { readStream } from './readStream';

function mergeStreams(...streams: Stream[]) {
  let pass = new PassThrough();
  let waiting = streams.length;

  for (const stream of streams) {
    pass = stream.pipe(pass, { end: false });
    stream.once('end', () => --waiting === 0 && pass.emit('end'));
  }

  return pass;
}

export function readProcessOutput(
  process: ChildProcessWithoutNullStreams
): Promise<string> {
  return readStream(mergeStreams(process.stderr, process.stdout));
}

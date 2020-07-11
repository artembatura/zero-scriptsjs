import MultiStream from '@nearform/multistream';
import { ChildProcessWithoutNullStreams } from 'child_process';

import { readStream } from './readStream';

export function readProcessOutput(process: ChildProcessWithoutNullStreams) {
  return readStream(new MultiStream([process.stderr, process.stdout]));
}

declare module '@nearform/multistream' {
  import { Stream } from 'stream';

  interface FactoryStreamCallback {
    (err: Error | null, stream: null): any;
    (err: null, stream: NodeJS.ReadableStream): any;
  }

  interface MultiStream extends NodeJS.ReadableStream {
    (streams: multistream.Streams): NodeJS.ReadableStream;
    new (streams: multistream.Streams): NodeJS.ReadableStream;
  }

  namespace multistream {
    type LazyStream = () => Stream;
    type FactoryStream = (cb: FactoryStreamCallback) => void;
    type Streams = Array<LazyStream | NodeJS.ReadableStream> | FactoryStream;

    function obj(streams: Streams): NodeJS.ReadableStream;
  }

  const _multistream: MultiStream;

  export = _multistream;
}

declare module '@nearform/multistream' {
  import { Stream } from 'stream';

  function multistream(streams: multistream.Streams): NodeJS.ReadableStream;

  interface FactoryStreamCallback {
    (err: Error | null, stream: null): any;
    (err: null, stream: NodeJS.ReadableStream): any;
  }

  namespace multistream {
    type LazyStream = () => Stream;
    type FactoryStream = (cb: FactoryStreamCallback) => void;
    type Streams = Array<LazyStream | NodeJS.ReadableStream> | FactoryStream;

    function obj(streams: Streams): NodeJS.ReadableStream;
  }

  interface MultiStream extends NodeJS.ReadableStream {
    new (streams: multistream.Streams);
  }

  let ms: MultiStream;

  export = ms;
}

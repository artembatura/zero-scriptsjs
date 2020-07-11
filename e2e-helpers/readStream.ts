export async function readStream(stream: NodeJS.ReadableStream) {
  let output: string = '';

  for await (const chunk of stream) {
    output += chunk.toString();
  }

  return output;
}

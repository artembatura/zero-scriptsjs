export type CreateWebpackConfigParameters = {
  entry: string[];
  outputPath: string;
  isDev: boolean;
  sourceMap: boolean;
  resolveExtensions: string[];
};

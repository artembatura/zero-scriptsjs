export const crossPlatformCommand = (cmd: string) =>
  process.platform === 'win32' ? cmd + '.cmd' : cmd;

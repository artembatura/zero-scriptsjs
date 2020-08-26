export function crossPlatformCommand(cmd: string): string {
  return process.platform === 'win32' ? cmd + '.cmd' : cmd;
}

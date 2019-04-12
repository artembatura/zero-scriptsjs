export function crossPlatformCommand(cmd: string) {
  return process.platform === 'win32' ? cmd + '.cmd' : cmd;
}

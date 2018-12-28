export const splitByUpperCase = (str: string) =>
  str.replace(/([A-Z])/g, symbol => ` ${symbol.toLowerCase()}`).split(' ');

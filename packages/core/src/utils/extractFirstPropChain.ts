export const extractFirstPropChain = (str: string): string => {
  const regex = /\.([a-zA-Z]+)/gm;
  let matchResults = regex.exec(str);
  let results: string[] = [];

  while (matchResults !== null) {
    results.push(matchResults[1]);
    matchResults = regex.exec(str);
  }

  if (results.length > 0) {
    return results.join('.');
  }

  throw new Error(`Can't parse property chain from string: "${str}"`);
};

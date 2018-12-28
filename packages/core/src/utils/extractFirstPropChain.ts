export const extractFirstPropChain = (str: string): string | null => {
  const regex = /\.([a-zA-Z]+)/gm;
  let matchResults = regex.exec(str);
  let results: string[] = [];

  while (matchResults !== null) {
    results.push(matchResults[1]);
    matchResults = regex.exec(str);
  }

  return results.length > 0 ? results.join('.') : null;
};

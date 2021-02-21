const packages: string[] = [
  '@babel/preset-react',
  'babel-plugin-transform-react-remove-prop-types',
  'babel-plugin-named-asset-import'
];

export default function resolveBabelPackages(config: string): string {
  let tempString = config;

  packages.forEach(pkgName => {
    if (tempString.includes(pkgName)) {
      tempString = tempString.replace(new RegExp(pkgName, 'g'), () =>
        require.resolve(pkgName)
      );
    }
  });

  return tempString;
}

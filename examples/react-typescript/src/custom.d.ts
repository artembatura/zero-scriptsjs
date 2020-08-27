declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.m.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

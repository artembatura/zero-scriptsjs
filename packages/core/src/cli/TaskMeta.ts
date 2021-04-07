export type TaskMeta<
  TName extends string = string,
  TArgs extends string[] = string[],
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = {
  args: TArgs;
  options: TOptions;
  name: TName;
};

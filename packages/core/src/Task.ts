import { AbstractTask } from './AbstractTask';

export class Task<TName extends string = string> extends AbstractTask {
  constructor(name: TName, protected readonly runner: AbstractTask['run']) {
    super(name);
  }

  public run<TArgs extends string[], TOptions extends Record<string, unknown>>(
    args: TArgs,
    options: TOptions
  ): void {
    this.runner(args, options);
  }
}

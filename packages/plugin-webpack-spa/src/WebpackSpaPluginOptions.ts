import detectCI from '@npmcli/ci-detect';

import {
  AbstractOptionsContainer,
  Option,
  getCurrentTaskMeta
} from '@zero-scripts/core';

import { TaskStart } from './tasks';

type DevServerOptions = {
  openInBrowser: boolean;
  port: number;
};

const defaultDevServerOptions: DevServerOptions = {
  openInBrowser: true,
  port: 8080
};

export class WebpackSpaPluginOptions extends AbstractOptionsContainer<
  WebpackSpaPluginOptions
> {
  @Option<WebpackSpaPluginOptions, 'devServer'>(
    ({ defaultValue, externalValue }) => {
      const options = {
        ...defaultValue,
        ...externalValue
      };

      const isCI = Boolean(detectCI());
      const taskMeta = getCurrentTaskMeta<TaskStart>();
      const taskPort =
        taskMeta && taskMeta.instance.name === 'start' && taskMeta.options.port;

      return {
        ...options,
        openInBrowser: !isCI,
        port: taskPort || options.port
      };
    }
  )
  public devServer: DevServerOptions = defaultDevServerOptions;
}

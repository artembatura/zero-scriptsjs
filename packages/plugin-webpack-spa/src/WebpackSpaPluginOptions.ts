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

export class WebpackSpaPluginOptions extends AbstractOptionsContainer<WebpackSpaPluginOptions> {
  @Option<WebpackSpaPluginOptions, 'devServer'>(
    ({ defaultValue, externalValue }) => {
      const options = {
        ...defaultValue,
        ...externalValue
      };

      const taskMeta = getCurrentTaskMeta<TaskStart>();

      const isCI = Boolean(detectCI());
      const isSmokeTest =
        taskMeta &&
        taskMeta.instance.name === 'start' &&
        taskMeta.options.smokeTest;
      const taskPort =
        taskMeta && taskMeta.instance.name === 'start' && taskMeta.options.port;

      return {
        ...options,
        openInBrowser: !isSmokeTest && !isCI && options.openInBrowser,
        port: taskPort || options.port
      };
    }
  )
  public devServer: DevServerOptions = defaultDevServerOptions;
}

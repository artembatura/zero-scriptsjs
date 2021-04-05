import detectCI from '@npmcli/ci-detect';

import {
  AbstractOptionsContainer,
  ExtractTaskMeta,
  Option
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
  @Option<WebpackSpaPluginOptions, 'devServer', ExtractTaskMeta<TaskStart>>(
    ({ defaultValue, externalValue, currentTask }) => {
      const options = {
        ...defaultValue,
        ...externalValue
      };

      const isCI = Boolean(detectCI());

      const isSmokeTest =
        currentTask?.name === 'start' && currentTask.options.smokeTest;

      const taskPort =
        currentTask?.name === 'start' && currentTask.options.port;

      return {
        ...options,
        openInBrowser: !isSmokeTest && !isCI && options.openInBrowser,
        port: taskPort || options.port
      };
    }
  )
  public devServer: DevServerOptions = defaultDevServerOptions;
}

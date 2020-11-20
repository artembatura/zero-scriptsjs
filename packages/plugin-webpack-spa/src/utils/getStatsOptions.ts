import webpack from 'webpack';

import Stats = webpack.Options.Stats;

export function getStatsOptions(stats?: Stats): Stats | undefined {
  // TODO remove after drop webpack@4
  if (webpack.Stats && webpack.Stats.presetToOptions) {
    if (!stats) {
      stats = {};
    } else if (typeof stats === 'boolean' || typeof stats === 'string') {
      stats = webpack.Stats.presetToOptions(stats);
    }
  }

  return stats;
}

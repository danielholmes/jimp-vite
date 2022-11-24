// This is based on the "jimp" root package. See:
// https://github.com/oliver-moran/jimp/blob/master/packages/jimp/src/index.js
import { mergeDeep } from 'timm';
import configure from '@jimp/custom';
import jpeg from '@jimp/jpeg';

const plugins = [] as any;

const pluginsEntry = (jimpEvChange: any) => {
  const initializedPlugins = plugins.map((pluginModule: any) => {
    let plugin = pluginModule(jimpEvChange) || {};

    if (!plugin.class && !plugin.constants) {
      // Default to class function
      plugin = { class: plugin };
    }

    return plugin;
  }) as any;

  if (initializedPlugins.length === 0) {
    return {};
  }

  return (mergeDeep as any)(...initializedPlugins);
};

export default configure({
  types: [() => mergeDeep(jpeg()) as any],
  plugins: [pluginsEntry]
});
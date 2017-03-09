// @flow
// main entry point

import createRIWFromConfig from './lib/riw';
import { configDefault } from './lib/config';

export default (configOverride: RIWConfigSparse) => createRIWFromConfig({
    ...configDefault,
    ...configOverride,
});

// @flow

import status from './status';
import translate from './translate';

export default (config: RIWConfig) => ({
    status: status(config),
    translate: translate(config),
});

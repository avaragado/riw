// @flow

import db from './db';
import translate from './translate';

export const sDescriptionDefault = '_';

export default (config: RIWConfig): RIW => ({
    config,
    db: db(config),
    project: {
        translate: translate(config),
    },
});

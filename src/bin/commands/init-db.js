// @flow

import log from '../../lib/log';
import { createHandlerWithRIW } from '../utils';

export const command = 'init-db';
export const desc = 'Create an empty riw translations database in the configured location';

export const handler = createHandlerWithRIW((riw: RIW) => {
    riw.initDB();

    log.info('riw', `Created empty riw database file ${riw.config.translationsDatabaseFile}.`);
    log.info('riw', 'We recommend you check this file into git.');
});

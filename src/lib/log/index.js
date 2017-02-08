// @flow

import log from 'npmlog';

// levels in order: silly, verbose, info, http, warn, error, silent

log.level = process.env.LOGLEVEL || 'info';

export default log;

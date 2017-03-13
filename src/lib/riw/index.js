// @flow

import db from './db';
import app from './app';

export const sDescriptionDefault = '_';

export default (config: RIWConfig): RIW => ({
    config,
    db: db(config),
    app: app(config),
});

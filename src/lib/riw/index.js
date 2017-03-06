// @flow

import db from './db';
import project from './project';

export const sDescriptionDefault = '_';

export default (config: RIWConfig): RIW => ({
    config,
    db: db(config),
    project: project(config),
});

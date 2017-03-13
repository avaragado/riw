// @flow

import fs from 'fs';

import mock from 'mock-fs';

import { configResolve } from '../../../config';

import init from '../init';
import dbEmpty from '../meta/dbEmpty';

const frelDB = 'db.json';

const cfgBase: RIWConfigSparseWithSource = {
    translationsDatabaseFile: frelDB,
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/db/init', () => {
    beforeEach(() => {
        mock({
            fixture: {},
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('writes empty database', () => {
        const cfg = configResolve(cfgBase);

        init(cfg)();

        const content = fs.readFileSync(frelDB).toString();

        expect(content).toEqual(stringify(dbEmpty));
    });
});

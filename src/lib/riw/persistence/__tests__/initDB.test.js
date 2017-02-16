// @flow

import fs from 'fs';

import mock from 'mock-fs';

import initDB from '../initDB';
import rdbEmpty from '../../util/rdbEmpty';

const cfgBase: RIWConfig = {
    defaultLocale: 'aa-bb',
    targetLocales: [],
    translationsDatabaseFile: 'fixture/riw-db.json',
};

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/persistence/initDB', () => {
    beforeEach(() => {
        mock({
            fixture: {},
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('writes empty database', () => {
        initDB(cfgBase)();

        const content = fs.readFileSync(cfgBase.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(rdbEmpty));
    });
});

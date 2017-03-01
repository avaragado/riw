// @flow

import fs from 'fs';

import mock from 'mock-fs';

import init from '../init';
import dbEmpty from '../meta/dbEmpty';
import cfgBase from '../../__tests__/helpers/dummyConfig';

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
        init(cfgBase)();

        const content = fs.readFileSync(cfgBase.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(dbEmpty));
    });
});

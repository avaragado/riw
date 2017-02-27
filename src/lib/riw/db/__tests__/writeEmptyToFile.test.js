// @flow

import fs from 'fs';

import mock from 'mock-fs';

import writeEmptyToFile from '../writeEmptyToFile';
import dbEmpty from '../dbEmpty';
import cfgBase from '../../__tests__/helpers/dummyConfig';

const stringify = obj => JSON.stringify(obj, null, 4);

describe('lib/riw/db/writeEmptyToFile', () => {
    beforeEach(() => {
        mock({
            fixture: {},
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('writes empty database', () => {
        writeEmptyToFile(cfgBase)();

        const content = fs.readFileSync(cfgBase.translationsDatabaseFile).toString();

        expect(content).toEqual(stringify(dbEmpty));
    });
});

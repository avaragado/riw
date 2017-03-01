// @flow

import version from '../version';
import dbEmpty from '../dbEmpty';

describe('lib/riw/db/meta/dbEmpty', () => {
    it('has the current version', () => {
        expect(dbEmpty.version).toEqual(version);
    });

    it('has empty data', () => {
        expect(dbEmpty.data).toEqual({});
    });
});


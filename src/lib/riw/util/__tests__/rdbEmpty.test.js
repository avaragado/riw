// @flow

import rdbEmpty from '../rdbEmpty';

describe('lib/riw/util/rdbEmpty', () => {
    it('has a version', () => {
        expect(rdbEmpty.version).toEqual(expect.any(Number));
    });

    it('has empty data', () => {
        expect(rdbEmpty.data).toEqual({});
    });
});


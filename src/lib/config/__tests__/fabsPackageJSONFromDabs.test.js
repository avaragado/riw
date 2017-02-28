// @flow

import path from 'path';

import fabsPackageJSONFromDabs from '../fabsPackageJSONFromDabs';

describe('lib/config/fabsPackageJSONFromDabs', () => {
    const dabsF01: AbsolutePath = path.resolve(__dirname, 'fixtures', '01-pkg-ok');
    const fabsF01Expected = path.resolve(dabsF01, 'package.json');

    it('should return the path to the closest package.json from a subdir', () => {
        const dabsTest: AbsolutePath = path.resolve(dabsF01, 'subdir');

        expect(fabsPackageJSONFromDabs(dabsTest)).toBe(fabsF01Expected);
    });

    it('should return the path to the package.json in the same dir', () => {
        expect(fabsPackageJSONFromDabs(dabsF01)).toBe(fabsF01Expected);
    });

    it('should return null if no root dir found', () => {
        expect(fabsPackageJSONFromDabs('/tmp')).toBeNull();
    });
});

// @flow

import type { AbsolutePath } from '../../../../types';
import fabsConfigPackageFromPackageJSONFabs from '../fabsConfigPackageFromPackageJSONFabs';

describe('lib/config/fabsConfigPackageFromPackageJSONFabs', () => {
    it('should return the path to the .riw-config.js file alongside a package.json', () => {
        const fabsTest: AbsolutePath = '/foo/bar/package.json';
        const fabsExpected: AbsolutePath = '/foo/bar/.riw-config.js';

        expect(fabsConfigPackageFromPackageJSONFabs(fabsTest)).toBe(fabsExpected);
    });

    it('should return null if null passed in', () => {
        expect(fabsConfigPackageFromPackageJSONFabs(null)).toBeNull();
    });
});

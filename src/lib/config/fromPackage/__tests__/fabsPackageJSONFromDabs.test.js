// @flow

import path from 'path';

import mock from 'mock-fs';

import fabsPackageJSONFromDabs from '../fabsPackageJSONFromDabs';

describe('lib/config/fromPackage/fabsPackageJSONFromDabs', () => {
    afterEach(() => {
        mock.restore();
    });

    it('should return the path to the closest package.json from a subdir', () => {
        mock({
            fixture: {
                'package.json': '{}',
                'dir': {
                    'sub': {},
                },
            },
        });

        const dabsTest: AbsolutePath = path.resolve('fixture', 'dir', 'sub');
        const fabsExpected: AbsolutePath = path.resolve('fixture', 'package.json');

        expect(fabsPackageJSONFromDabs(dabsTest)).toBe(fabsExpected);
    });

    it('should return the path to the package.json in the same dir', () => {
        mock({
            fixture: {
                'package.json': '{}',
            },
        });

        const dabsTest: AbsolutePath = path.resolve('fixture');
        const fabsExpected: AbsolutePath = path.resolve('fixture', 'package.json');

        expect(fabsPackageJSONFromDabs(dabsTest)).toBe(fabsExpected);
    });

    it('should return null if no root dir found', () => {
        expect(fabsPackageJSONFromDabs('/tmp')).toBeNull();
    });
});

// @flow

// these tests can't use mock-fs as the code uses require to allow users
// to write node modules that export configuration, and those modules might
// need other resources, eg babel. mock-fs 4.1.x replaces the ENTIRE filesystem,
// it doesn't overlay a mock one on the real one -- so those modules and the node
// core have no access to files not mocked.

import path from 'path';

import fabsConfigPackageForCWD from '../fabsConfigPackageForCWD';

describe('lib/config/fromPackage/fabsConfigPackageForCWD', () => {
    let cwd;

    beforeEach(() => {
        cwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(cwd);
    });

    const dabs: AbsolutePath = path.resolve(__dirname, 'fixtures', '04');
    const fabsExpected = path.resolve(dabs, '.riw-config.js');

    it('returns the path to the package .riw-config.js from a subdir even though file does not exist', () => {
        process.chdir(path.resolve(dabs, 'subdir'));

        expect(fabsConfigPackageForCWD()).toBe(fabsExpected);
    });

    it('returns the path to the package .riw-config.js from the package root even though file does not exist', () => {
        process.chdir(dabs);

        expect(fabsConfigPackageForCWD()).toBe(fabsExpected);
    });

    it('should return null if no root dir found', () => {
        process.chdir(path.resolve('/tmp'));

        expect(fabsConfigPackageForCWD()).toBeNull();
    });
});

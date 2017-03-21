// @flow

// these tests can't use mock-fs as the code uses require to allow users
// to write node modules that export configuration, and those modules might
// need other resources, eg babel. mock-fs 4.1.x replaces the ENTIRE filesystem,
// it doesn't overlay a mock one on the real one -- so those modules and the node
// core have no access to files not mocked.

import path from 'path';

import configFromPackage from '../';

const dabsFixtures = path.resolve(__dirname, 'fixtures');

describe('lib/config/fromPackage', () => {
    let cwd;

    beforeEach(() => {
        cwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(cwd);
    });

    it('should return the package .riw-config if present, ignoring package.json', () => {
        const dabs = path.resolve(dabsFixtures, '01');
        const fabs = path.resolve(dabs, '.riw-config.js');

        process.chdir(dabs);

        const configOverride = require(fabs);

        expect(configFromPackage()).toEqual({
            ...configOverride,
            configFile: fabs,
        });
    });

    it('should return the package.json riw key if present and no .riw-config', () => {
        const dabs = path.resolve(dabsFixtures, '02');
        const fabs = path.resolve(dabs, 'package.json');

        process.chdir(dabs);

        const configOverride = require(fabs).riw;

        expect(configFromPackage()).toEqual({
            ...configOverride,
            configFile: fabs,
        });
    });

    it('should return very little if no .riw-config and package.json has no riw key', () => {
        const dabs = path.resolve(dabsFixtures, '03');
        const fabs = path.resolve(dabs, 'package.json');

        process.chdir(dabs);

        expect(configFromPackage()).toEqual({
            configFile: fabs,
        });
    });

    it('should return null if no root dir found', () => {
        process.chdir(path.resolve('/tmp'));

        expect(configFromPackage()).toBeNull();
    });
});
